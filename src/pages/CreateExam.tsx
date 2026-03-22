import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  AlertTriangle,
  Pencil,
  Trash2,
  Plus,
  Zap,
  ArrowRight,
  Upload,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import type { Step, ParsedQuestion } from "@/components/create-exam/types";
import { typeLabel, typeColor } from "@/components/create-exam/types";
import { UploadStep } from "@/components/create-exam/UploadStep";
import { GenerateStep } from "@/components/create-exam/GenerateStep";

type SourceMode = "upload" | "generate";

export default function CreateExam() {
  const [step, setStep] = useState<Step>("upload");
  const [sourceMode, setSourceMode] = useState<SourceMode>("upload");
  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);

  const handleQuestionsReady = (q: ParsedQuestion[]) => {
    setQuestions(q);
    setStep("review");
  };

  const handlePublish = () => {
    toast.success("Exam published! Google Form link generated.");
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="animate-reveal-up">
        <h1 className="text-2xl font-bold text-foreground">Create Exam</h1>
        <p className="mt-1 text-muted-foreground">Upload questions, generate from syllabus, review, and publish.</p>
      </div>

      {/* Steps */}
      <div className="mt-8 flex items-center gap-3 animate-reveal-up stagger-1">
        {(["upload", "review", "configure"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <button
              onClick={() => {
                if (s === "upload") setStep("upload");
                if (s === "review" && questions.length > 0) setStep("review");
                if (s === "configure" && questions.length > 0) setStep("configure");
              }}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                step === s
                  ? "bg-primary text-primary-foreground"
                  : questions.length > 0 || s === "upload"
                  ? "bg-muted text-muted-foreground hover:bg-muted/80"
                  : "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
              )}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-current/20 text-xs">
                {i + 1}
              </span>
              {s === "upload" ? "Source" : s === "review" ? "Review" : "Configure"}
            </button>
            {i < 2 && <ArrowRight className="h-4 w-4 text-muted-foreground/40" />}
          </div>
        ))}
      </div>

      {/* Upload/Generate Step */}
      {step === "upload" && (
        <div className="mt-8 space-y-6 animate-reveal-up stagger-2">
          {/* Source Mode Toggle */}
          <div className="flex rounded-xl border bg-muted/40 p-1 max-w-md">
            <button
              onClick={() => setSourceMode("upload")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all active:scale-[0.97]",
                sourceMode === "upload"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Upload className="h-4 w-4" />
              Upload File
            </button>
            <button
              onClick={() => setSourceMode("generate")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all active:scale-[0.97]",
                sourceMode === "generate"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sparkles className="h-4 w-4" />
              Generate from Syllabus
            </button>
          </div>

          {sourceMode === "upload" ? (
            <UploadStep onQuestionsReady={handleQuestionsReady} />
          ) : (
            <GenerateStep onQuestionsReady={handleQuestionsReady} />
          )}
        </div>
      )}

      {/* Review Step */}
      {step === "review" && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between animate-reveal-up stagger-2">
            <div>
              <h2 className="text-lg font-semibold">{questions.length} Questions Extracted</h2>
              <p className="text-sm text-muted-foreground">
                {questions.filter((q) => q.flagged).length > 0 && (
                  <span className="text-warning">
                    {questions.filter((q) => q.flagged).length} flagged for review
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setStep("upload")}>
                Back to Source
              </Button>
              <Button size="sm" onClick={() => setStep("configure")}>
                Continue
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>

          {questions.map((q, i) => (
            <div
              key={q.id}
              className={cn(
                "animate-reveal-up rounded-xl border bg-card p-5 transition-shadow hover:shadow-sm",
                q.flagged && "border-warning/40 bg-warning/5"
              )}
              style={{ animationDelay: `${200 + i * 80}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-muted-foreground">Q{q.id}</span>
                    <Badge className={cn("rounded-full border-0 text-xs", typeColor[q.type])}>
                      {typeLabel[q.type]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{q.marks} marks</span>
                    {q.flagged && (
                      <span className="flex items-center gap-1 text-xs text-warning">
                        <AlertTriangle className="h-3 w-3" />
                        Needs review
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-card-foreground">{q.text}</p>
                  {q.options && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {q.options.map((opt, oi) => (
                        <div
                          key={oi}
                          className={cn(
                            "rounded-lg border px-3 py-2 text-sm",
                            opt === q.answer
                              ? "border-success/40 bg-success/10 text-success font-medium"
                              : "border-border text-muted-foreground"
                          )}
                        >
                          {String.fromCharCode(65 + oi)}. {opt}
                          {opt === q.answer && <CheckCircle2 className="ml-2 inline h-3.5 w-3.5" />}
                        </div>
                      ))}
                    </div>
                  )}
                  {q.type === "short" && q.answer && (
                    <p className="mt-2 text-sm text-success">
                      <span className="font-medium">Answer:</span> {q.answer}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-4 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary active:scale-[0.99]">
            <Plus className="h-4 w-4" />
            Add question manually
          </button>
        </div>
      )}

      {/* Configure Step */}
      {step === "configure" && (
        <div className="mt-8 animate-reveal-up stagger-2 max-w-xl space-y-6">
          <div className="space-y-2">
            <Label>Exam Title</Label>
            <Input defaultValue="Mid-Term Mathematics Examination" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select defaultValue="mathematics">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="science">Integrated Science</SelectItem>
                  <SelectItem value="english">English Language</SelectItem>
                  <SelectItem value="social">Social Studies</SelectItem>
                  <SelectItem value="ict">ICT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Grade Level</Label>
              <Select defaultValue="jhs3">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="jhs1">JHS 1</SelectItem>
                  <SelectItem value="jhs2">JHS 2</SelectItem>
                  <SelectItem value="jhs3">JHS 3</SelectItem>
                  <SelectItem value="shs1">SHS 1</SelectItem>
                  <SelectItem value="shs2">SHS 2</SelectItem>
                  <SelectItem value="shs3">SHS 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duration</Label>
              <Select defaultValue="120">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1 hour 30 min</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="180">3 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Submission Deadline</Label>
              <Input type="datetime-local" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Instructions (optional)</Label>
            <Textarea placeholder="Any special instructions for students..." rows={3} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setStep("review")}>Back to Review</Button>
            <Button onClick={handlePublish} className="gap-2">
              <Zap className="h-4 w-4" />
              Generate Exam & Publish
            </Button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
