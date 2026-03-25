import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Send, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ExamQuestion {
  id: string;
  question_number: number;
  type: string;
  text: string;
  options: string[] | null;
  marks: number;
}

interface ExamInfo {
  id: string;
  title: string;
  subject: string;
  grade: string;
  deadline: string | null;
}

export default function TakeExam() {
  const { examId } = useParams<{ examId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [exam, setExam] = useState<ExamInfo | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  useEffect(() => {
    if (!examId || !user) return;

    const load = async () => {
      setLoading(true);

      // Fetch exam info
      const { data: examData } = await supabase
        .from("published_exams")
        .select("id, title, subject, grade, deadline")
        .eq("id", examId)
        .eq("is_active", true)
        .maybeSingle();

      if (!examData) {
        toast.error("Exam not found or is no longer active.");
        navigate("/");
        return;
      }
      setExam(examData);

      // Fetch questions
      const { data: qData } = await supabase
        .from("exam_questions")
        .select("id, question_number, type, text, options, marks")
        .eq("exam_id", examId)
        .order("question_number");

      setQuestions(qData ?? []);

      // Check/create submission
      const { data: existing } = await supabase
        .from("student_submissions")
        .select("id, answers, status")
        .eq("exam_id", examId)
        .eq("student_id", user.id)
        .maybeSingle();

      if (existing) {
        if (existing.status === "submitted" || existing.status === "graded") {
          toast.info("You have already submitted this exam.");
          navigate("/");
          return;
        }
        setSubmissionId(existing.id);
        setAnswers((existing.answers as Record<string, string>) ?? {});
      } else {
        const { data: newSub } = await supabase
          .from("student_submissions")
          .insert({ exam_id: examId, student_id: user.id })
          .select("id")
          .single();
        if (newSub) setSubmissionId(newSub.id);
      }

      setLoading(false);
    };

    load();
  }, [examId, user, navigate]);

  const saveProgress = async (newAnswers: Record<string, string>) => {
    if (!submissionId) return;
    await supabase
      .from("student_submissions")
      .update({ answers: newAnswers })
      .eq("id", submissionId);
  };

  const handleAnswer = (questionId: string, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    // Debounced save
    saveProgress(updated);
  };

  const handleSubmit = async () => {
    if (!submissionId) return;
    setSubmitting(true);

    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

    await supabase
      .from("student_submissions")
      .update({
        answers,
        status: "submitted",
        submitted_at: new Date().toISOString(),
        total_marks: totalMarks,
      })
      .eq("id", submissionId);

    toast.success("Exam submitted successfully!");
    setSubmitting(false);
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">No questions found for this exam.</p>
          <Button className="mt-4" onClick={() => navigate("/")}>Go Back</Button>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];
  const answeredCount = Object.keys(answers).filter((k) => answers[k]?.trim()).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <div>
            <h1 className="text-lg font-bold text-foreground">{exam.title}</h1>
            <p className="text-xs text-muted-foreground">{exam.subject} · {exam.grade}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="border-0 bg-primary/10 text-primary">
              {answeredCount}/{questions.length} answered
            </Badge>
            {exam.deadline && (
              <Badge className="border-0 bg-warning/10 text-warning">
                <Clock className="mr-1 h-3 w-3" />
                {new Date(exam.deadline).toLocaleString()}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Question navigator */}
      <div className="mx-auto max-w-3xl px-6 pt-4">
        <div className="flex flex-wrap gap-2 mb-6">
          {questions.map((qq, i) => (
            <button
              key={qq.id}
              onClick={() => setCurrentQ(i)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all",
                currentQ === i
                  ? "bg-primary text-primary-foreground"
                  : answers[qq.id]?.trim()
                  ? "bg-success/15 text-success"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Current question */}
      <div className="mx-auto max-w-3xl px-6 pb-32">
        <div className="animate-reveal-up rounded-xl border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-bold text-muted-foreground">Question {currentQ + 1}</span>
            <Badge className="border-0 bg-muted text-muted-foreground text-xs">
              {q.type === "mcq" ? "Multiple Choice" : q.type === "short" ? "Short Answer" : "Essay"}
            </Badge>
            <span className="text-xs text-muted-foreground">{q.marks} marks</span>
          </div>

          <p className="text-foreground font-medium">{q.text}</p>

          <div className="mt-6">
            {q.type === "mcq" && q.options ? (
              <div className="space-y-2">
                {(q.options as string[]).map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(q.id, opt)}
                    className={cn(
                      "w-full rounded-lg border px-4 py-3 text-left text-sm transition-all",
                      answers[q.id] === opt
                        ? "border-primary bg-primary/5 text-primary font-medium"
                        : "border-border text-foreground hover:border-primary/30"
                    )}
                  >
                    {String.fromCharCode(65 + i)}. {opt}
                  </button>
                ))}
              </div>
            ) : q.type === "short" ? (
              <Input
                placeholder="Type your answer..."
                value={answers[q.id] ?? ""}
                onChange={(e) => handleAnswer(q.id, e.target.value)}
              />
            ) : (
              <Textarea
                placeholder="Write your answer..."
                value={answers[q.id] ?? ""}
                onChange={(e) => handleAnswer(q.id, e.target.value)}
                rows={6}
              />
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>

          {currentQ < questions.length - 1 ? (
            <Button onClick={() => setCurrentQ(currentQ + 1)}>
              Next
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-success text-success-foreground hover:bg-success/90"
            >
              {submitting ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Send className="mr-1 h-4 w-4" />}
              Submit Exam
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
