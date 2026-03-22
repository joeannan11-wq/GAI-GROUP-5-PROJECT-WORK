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
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Pencil,
  Trash2,
  Plus,
  Zap,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

type Step = "upload" | "review" | "configure";

interface ParsedQuestion {
  id: number;
  type: "mcq" | "short" | "essay";
  text: string;
  options?: string[];
  answer?: string;
  marks: number;
  flagged?: boolean;
}

const sampleQuestions: ParsedQuestion[] = [
  { id: 1, type: "mcq", text: "What is the value of x if 2x + 5 = 15?", options: ["3", "5", "7", "10"], answer: "5", marks: 2 },
  { id: 2, type: "mcq", text: "Which of the following is a prime number?", options: ["4", "9", "11", "15"], answer: "11", marks: 2 },
  { id: 3, type: "short", text: "Simplify the expression: 3(x + 4) - 2(x - 1)", answer: "x + 14", marks: 3 },
  { id: 4, type: "essay", text: "Explain the difference between a linear equation and a quadratic equation. Provide examples of each.", marks: 10, flagged: true },
  { id: 5, type: "mcq", text: "What is the area of a circle with radius 7 cm? (Use π = 22/7)", options: ["44 cm²", "154 cm²", "88 cm²", "308 cm²"], answer: "154 cm²", marks: 2 },
];

const typeLabel = {
  mcq: "Multiple Choice",
  short: "Short Answer",
  essay: "Essay",
};

const typeColor = {
  mcq: "bg-info/15 text-info",
  short: "bg-secondary/20 text-secondary-foreground",
  essay: "bg-primary/10 text-primary",
};

export default function CreateExam() {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);

  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
    setParsing(true);
    setTimeout(() => {
      setParsing(false);
      setQuestions(sampleQuestions);
      setStep("review");
      toast.success("5 questions extracted successfully!");
    }, 2000);
  };

  const handlePublish = () => {
    toast.success("Exam published! Google Form link generated.");
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="animate-reveal-up">
        <h1 className="text-2xl font-bold text-foreground">Create Exam</h1>
        <p className="mt-1 text-muted-foreground">Upload questions, review, and publish to students.</p>
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
              {s === "upload" ? "Upload" : s === "review" ? "Review" : "Configure"}
            </button>
            {i < 2 && <ArrowRight className="h-4 w-4 text-muted-foreground/40" />}
          </div>
        ))}
      </div>

      {/* Upload Step */}
      {step === "upload" && (
        <div className="mt-8 animate-reveal-up stagger-2">
          <div
            className={cn(
              "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-colors",
              file ? "border-primary/40 bg-primary/5" : "border-border bg-card"
            )}
          >
            {file ? (
              <>
                <div className="rounded-full bg-success/10 p-4">
                  <FileText className="h-8 w-8 text-success" />
                </div>
                <p className="mt-4 text-sm font-semibold text-foreground">{file.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setFile(null)}>Remove</Button>
                  <Button size="sm" onClick={handleUpload} disabled={parsing}>
                    {parsing ? (
                      <>
                        <Zap className="h-4 w-4 animate-pulse" />
                        Parsing with AI...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Extract Questions
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-full bg-muted p-4">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="mt-4 text-sm font-semibold text-foreground">Upload exam questions</p>
                <p className="mt-1 text-xs text-muted-foreground">PDF or Word document · Max 10MB</p>
                <label className="mt-4">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <span className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.97]">
                    <Upload className="h-4 w-4" />
                    Choose File
                  </span>
                </label>
              </>
            )}
          </div>
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
                Re-upload
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
