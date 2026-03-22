import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Zap, BookOpen, GraduationCap, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { ParsedQuestion } from "./types";
import { ghanaTopics, sampleQuestions } from "./types";

interface GenerateStepProps {
  onQuestionsReady: (questions: ParsedQuestion[]) => void;
}

const subjectLabels: Record<string, string> = {
  mathematics: "Mathematics",
  science: "Integrated Science",
  english: "English Language",
  social: "Social Studies",
  ict: "ICT",
};

const gradeLabels: Record<string, string> = {
  jhs1: "JHS 1",
  jhs2: "JHS 2",
  jhs3: "JHS 3",
  shs1: "SHS 1",
  shs2: "SHS 2",
  shs3: "SHS 3",
};

const difficultyLabels: Record<string, { label: string; color: string }> = {
  easy: { label: "Easy", color: "bg-success/15 text-success" },
  moderate: { label: "Moderate", color: "bg-warning/15 text-warning" },
  hard: { label: "Hard", color: "bg-destructive/15 text-destructive" },
  mixed: { label: "Mixed", color: "bg-info/15 text-info" },
};

export function GenerateStep({ onQuestionsReady }: GenerateStepProps) {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [mcqCount, setMcqCount] = useState([5]);
  const [shortCount, setShortCount] = useState([3]);
  const [essayCount, setEssayCount] = useState([1]);
  const [difficulty, setDifficulty] = useState("moderate");
  const [generating, setGenerating] = useState(false);

  const availableTopics = subject && grade ? (ghanaTopics[subject]?.[grade] ?? []) : [];

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const totalQuestions = mcqCount[0] + shortCount[0] + essayCount[0];

  const handleGenerate = () => {
    if (!subject || !grade) {
      toast.error("Please select a subject and grade level");
      return;
    }
    if (selectedTopics.length === 0) {
      toast.error("Please select at least one topic");
      return;
    }
    if (totalQuestions === 0) {
      toast.error("Add at least one question");
      return;
    }

    setGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setGenerating(false);
      const generatedQuestions: ParsedQuestion[] = sampleQuestions.slice(0, Math.min(totalQuestions, 5));
      onQuestionsReady(generatedQuestions);
      toast.success(`${generatedQuestions.length} questions generated from GES syllabus!`);
    }, 3000);
  };

  return (
    <div className="rounded-2xl border bg-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-2.5">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Question Generator</h3>
          <p className="text-xs text-muted-foreground">
            Generate questions aligned with the Ghana Education Service syllabus
          </p>
        </div>
      </div>

      {/* Subject & Grade */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
            Subject
          </Label>
          <Select
            value={subject}
            onValueChange={(v) => {
              setSubject(v);
              setSelectedTopics([]);
            }}
          >
            <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
            <SelectContent>
              {Object.entries(subjectLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
            Grade Level
          </Label>
          <Select
            value={grade}
            onValueChange={(v) => {
              setGrade(v);
              setSelectedTopics([]);
            }}
          >
            <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
            <SelectContent>
              {Object.entries(gradeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Syllabus Topics */}
      {availableTopics.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Syllabus Topics</Label>
            <button
              onClick={() =>
                setSelectedTopics(
                  selectedTopics.length === availableTopics.length ? [] : [...availableTopics]
                )
              }
              className="text-xs text-primary hover:underline"
            >
              {selectedTopics.length === availableTopics.length ? "Deselect all" : "Select all"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableTopics.map((topic) => {
              const isSelected = selectedTopics.includes(topic);
              return (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all active:scale-[0.97]",
                    isSelected
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/20 hover:bg-muted"
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    className="h-3.5 w-3.5 pointer-events-none"
                    tabIndex={-1}
                  />
                  {topic}
                </button>
              );
            })}
          </div>
          {selectedTopics.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {selectedTopics.length} topic{selectedTopics.length !== 1 ? "s" : ""} selected
            </p>
          )}
        </div>
      )}

      {/* Question Distribution */}
      <div className="space-y-4">
        <Label>Question Distribution</Label>
        <div className="grid gap-4 rounded-xl border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Multiple Choice</span>
            <div className="flex items-center gap-3">
              <Slider value={mcqCount} onValueChange={setMcqCount} min={0} max={20} step={1} className="w-28" />
              <span className="w-6 text-right text-sm font-semibold text-foreground">{mcqCount[0]}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Short Answer</span>
            <div className="flex items-center gap-3">
              <Slider value={shortCount} onValueChange={setShortCount} min={0} max={15} step={1} className="w-28" />
              <span className="w-6 text-right text-sm font-semibold text-foreground">{shortCount[0]}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Essay</span>
            <div className="flex items-center gap-3">
              <Slider value={essayCount} onValueChange={setEssayCount} min={0} max={5} step={1} className="w-28" />
              <span className="w-6 text-right text-sm font-semibold text-foreground">{essayCount[0]}</span>
            </div>
          </div>
          <div className="border-t pt-3 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Total Questions</span>
            <span className="text-sm font-bold text-primary">{totalQuestions}</span>
          </div>
        </div>
      </div>

      {/* Difficulty */}
      <div className="space-y-2">
        <Label>Difficulty Level</Label>
        <div className="flex gap-2">
          {Object.entries(difficultyLabels).map(([key, { label, color }]) => (
            <button
              key={key}
              onClick={() => setDifficulty(key)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all active:scale-[0.97]",
                difficulty === key
                  ? cn(color, "border-current/20")
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={generating || !subject || !grade || selectedTopics.length === 0}
        className="w-full gap-2"
        size="lg"
      >
        {generating ? (
          <>
            <Zap className="h-4 w-4 animate-pulse" />
            Generating from GES Syllabus...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate {totalQuestions} Questions
          </>
        )}
      </Button>
    </div>
  );
}
