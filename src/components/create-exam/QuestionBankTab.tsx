import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, Library, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ParsedQuestion } from "./types";

const typeLabel = { mcq: "MCQ", short: "Short Answer", essay: "Essay" };
const typeColor = {
  mcq: "bg-info/15 text-info",
  short: "bg-secondary/20 text-secondary-foreground",
  essay: "bg-primary/10 text-primary",
};

interface QuestionBankTabProps {
  onQuestionsSelected: (questions: ParsedQuestion[]) => void;
}

interface BankQuestion {
  id: string;
  subject: string;
  grade: string;
  topic: string;
  type: string;
  text: string;
  options: string[] | null;
  correct_answer: string | null;
  marks: number;
  difficulty: string;
}

export function QuestionBankTab({ onQuestionsSelected }: QuestionBankTabProps) {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!subject || !grade) {
      setQuestions([]);
      setSelected(new Set());
      return;
    }
    const fetchQuestions = async () => {
      setLoading(true);
      let query = supabase
        .from("question_bank" as any)
        .select("*")
        .eq("subject", subject)
        .eq("grade", grade);

      if (difficulty !== "all") {
        query = query.eq("difficulty", difficulty);
      }

      const { data, error } = await query.order("topic");
      if (error) {
        toast.error("Failed to load questions");
        console.error(error);
      } else {
        setQuestions((data as any[]) || []);
      }
      setSelected(new Set());
      setLoading(false);
    };
    fetchQuestions();
  }, [subject, grade, difficulty]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === questions.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(questions.map((q) => q.id)));
    }
  };

  const handleAddSelected = () => {
    const selectedQs = questions.filter((q) => selected.has(q.id));
    const parsed: ParsedQuestion[] = selectedQs.map((q, i) => ({
      id: i + 1,
      type: q.type as "mcq" | "short" | "essay",
      text: q.text,
      options: q.options || undefined,
      answer: q.correct_answer || undefined,
      marks: q.marks,
    }));
    onQuestionsSelected(parsed);
    toast.success(`${parsed.length} questions added from question bank!`);
  };

  const groupedByTopic: Record<string, BankQuestion[]> = {};
  questions.forEach((q) => {
    if (!groupedByTopic[q.topic]) groupedByTopic[q.topic] = [];
    groupedByTopic[q.topic].push(q);
  });

  return (
    <div className="rounded-2xl border bg-card p-6 space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-full bg-accent/15 p-2.5">
          <Library className="h-5 w-5 text-accent-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Question Bank</h3>
          <p className="text-xs text-muted-foreground">
            Browse pre-made GES syllabus questions and pick the ones you want
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
            Subject
          </Label>
          <Select value={subject} onValueChange={(v) => { setSubject(v); setGrade(""); }}>
            <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
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
          <Label className="flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
            Grade Level
          </Label>
          <Select value={grade} onValueChange={setGrade}>
            <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
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
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading questions...
        </div>
      )}

      {!loading && subject && grade && questions.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">
          No questions available for this subject and grade yet.
        </p>
      )}

      {!loading && questions.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <button
              onClick={selectAll}
              className="text-xs text-primary hover:underline"
            >
              {selected.size === questions.length ? "Deselect all" : `Select all (${questions.length})`}
            </button>
            <span className="text-xs text-muted-foreground">{selected.size} selected</span>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
            {Object.entries(groupedByTopic).map(([topic, qs]) => (
              <div key={topic}>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  {topic}
                </h4>
                <div className="space-y-2">
                  {qs.map((q) => (
                    <label
                      key={q.id}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors",
                        selected.has(q.id)
                          ? "border-primary/40 bg-primary/5"
                          : "border-border hover:border-primary/20"
                      )}
                    >
                      <Checkbox
                        checked={selected.has(q.id)}
                        onCheckedChange={() => toggleSelect(q.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={cn("rounded-full border-0 text-[10px] px-2 py-0", typeColor[q.type as keyof typeof typeColor] || "")}>
                            {typeLabel[q.type as keyof typeof typeLabel] || q.type}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">{q.marks} marks</span>
                          <span className="text-[10px] text-muted-foreground capitalize">• {q.difficulty}</span>
                        </div>
                        <p className="text-sm text-foreground">{q.text}</p>
                        {q.options && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {(q.options as string[]).map((opt, i) => (
                              <span
                                key={i}
                                className={cn(
                                  "text-[11px] rounded px-2 py-0.5 border",
                                  opt === q.correct_answer
                                    ? "border-success/40 bg-success/10 text-success"
                                    : "border-border text-muted-foreground"
                                )}
                              >
                                {String.fromCharCode(65 + i)}. {opt}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={handleAddSelected}
            disabled={selected.size === 0}
            className="w-full gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            Add {selected.size} Question{selected.size !== 1 ? "s" : ""} to Exam
          </Button>
        </>
      )}
    </div>
  );
}
