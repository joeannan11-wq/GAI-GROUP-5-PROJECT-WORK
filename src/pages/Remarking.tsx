import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Eye, Clock } from "lucide-react";
import { toast } from "sonner";

interface RemarkRequest {
  id: string;
  studentName: string;
  email: string;
  examTitle: string;
  examId: string;
  requestDate: string;
  status: "pending" | "under_review" | "resolved";
  originalScore: number;
  aiReScore?: number;
  finalScore?: number;
  decision?: "accepted" | "rejected";
}

const requests: RemarkRequest[] = [
  { id: "RMK-001", studentName: "Yaw Adjei", email: "yaw.adjei@school.gh", examTitle: "Mid-Term Mathematics", examId: "EXM-042", requestDate: "Mar 22, 2026", status: "pending", originalScore: 68 },
  { id: "RMK-002", studentName: "Adjoa Poku", email: "adjoa.poku@school.gh", examTitle: "Mid-Term Mathematics", examId: "EXM-042", requestDate: "Mar 21, 2026", status: "under_review", originalScore: 52, aiReScore: 57 },
  { id: "RMK-003", studentName: "Nana Appiah", email: "nana.appiah@school.gh", examTitle: "Science Weekly Quiz", examId: "EXM-039", requestDate: "Mar 20, 2026", status: "resolved", originalScore: 58, aiReScore: 62, finalScore: 62, decision: "accepted" },
  { id: "RMK-004", studentName: "Efua Takyi", email: "efua.takyi@school.gh", examTitle: "Mid-Term Mathematics", examId: "EXM-042", requestDate: "Mar 19, 2026", status: "resolved", originalScore: 38, aiReScore: 39, finalScore: 38, decision: "rejected" },
];

const statusConfig = {
  pending: { label: "Pending", class: "bg-warning/15 text-warning" },
  under_review: { label: "Under Review", class: "bg-info/15 text-info" },
  resolved: { label: "Resolved", class: "bg-success/15 text-success" },
};

export default function Remarking() {
  const [selected, setSelected] = useState<RemarkRequest | null>(null);

  const handleAccept = () => {
    toast.success("Re-mark accepted. Score updated.");
    setSelected(null);
  };

  const handleReject = () => {
    toast.info("Original score maintained.");
    setSelected(null);
  };

  return (
    <AppLayout>
      <div className="animate-reveal-up">
        <h1 className="text-2xl font-bold text-foreground">Remarking Requests</h1>
        <p className="mt-1 text-muted-foreground">{requests.filter((r) => r.status === "pending").length} pending reviews</p>
      </div>

      <div className="mt-8 grid grid-cols-5 gap-6">
        {/* List */}
        <div className="col-span-3 space-y-3">
          {requests.map((r, i) => {
            const sc = statusConfig[r.status];
            return (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className={cn(
                  "animate-reveal-up w-full rounded-xl border bg-card p-4 text-left transition-all duration-200 hover:shadow-sm active:scale-[0.99]",
                  selected?.id === r.id && "ring-2 ring-primary/30 border-primary/30"
                )}
                style={{ animationDelay: `${100 + i * 80}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">{r.studentName}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{r.examTitle} · {r.examId}</p>
                  </div>
                  <Badge className={cn("rounded-full border-0 text-xs", sc.class)}>{sc.label}</Badge>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {r.requestDate}
                  </span>
                  <span>Original: <span className="font-semibold text-card-foreground">{r.originalScore}%</span></span>
                  {r.aiReScore !== undefined && (
                    <span>AI Re-score: <span className={cn("font-semibold", r.aiReScore > r.originalScore ? "text-success" : "text-card-foreground")}>{r.aiReScore}%</span></span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="col-span-2">
          {selected ? (
            <div className="animate-fade-in sticky top-8 rounded-xl border bg-card p-6">
              <h3 className="text-lg font-semibold text-card-foreground">{selected.studentName}</h3>
              <p className="text-sm text-muted-foreground">{selected.email}</p>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Exam</span>
                  <span className="font-medium text-card-foreground">{selected.examTitle}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Exam ID</span>
                  <span className="font-mono text-xs text-card-foreground">{selected.examId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Request Date</span>
                  <span className="text-card-foreground">{selected.requestDate}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Original Score</span>
                  <span className="font-bold text-card-foreground">{selected.originalScore}%</span>
                </div>
                {selected.aiReScore !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">AI Re-score</span>
                    <span className={cn("font-bold", selected.aiReScore > selected.originalScore ? "text-success" : "text-card-foreground")}>
                      {selected.aiReScore}%
                      {selected.aiReScore > selected.originalScore && ` (+${selected.aiReScore - selected.originalScore})`}
                    </span>
                  </div>
                )}
                {selected.finalScore !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Final Score</span>
                    <span className="font-bold text-card-foreground">{selected.finalScore}%</span>
                  </div>
                )}
              </div>

              {selected.status === "pending" && (
                <div className="mt-6">
                  <Button className="w-full gap-2" size="sm">
                    <Eye className="h-4 w-4" />
                    Run AI Re-evaluation
                  </Button>
                </div>
              )}

              {selected.status === "under_review" && (
                <div className="mt-6 flex gap-2">
                  <Button onClick={handleAccept} className="flex-1 gap-1.5 bg-success hover:bg-success/90 text-success-foreground" size="sm">
                    <CheckCircle2 className="h-4 w-4" />
                    Accept
                  </Button>
                  <Button onClick={handleReject} variant="outline" className="flex-1 gap-1.5" size="sm">
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              )}

              {selected.status === "resolved" && (
                <div className="mt-6 rounded-lg bg-muted/50 p-3 text-center text-sm">
                  {selected.decision === "accepted" ? (
                    <p className="text-success font-medium">✓ Re-mark accepted · Score updated to {selected.finalScore}%</p>
                  ) : (
                    <p className="text-muted-foreground font-medium">Original score maintained</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="animate-fade-in flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-12 text-center">
              <Eye className="h-8 w-8 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">Select a request to view details</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
