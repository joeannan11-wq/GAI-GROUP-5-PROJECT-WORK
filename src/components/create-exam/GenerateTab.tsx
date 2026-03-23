import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, BookOpen, GraduationCap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ParsedQuestion } from "./types";

const syllabusTopics: Record<string, Record<string, string[]>> = {
  mathematics: {
    jhs1: ["Number and Numeration", "Basic Operations", "Fractions and Decimals", "Measurement and Shape", "Data Handling"],
    jhs2: ["Integers and Rational Numbers", "Algebraic Expressions", "Geometry and Angles", "Ratio and Proportion", "Statistics"],
    jhs3: ["Linear Equations", "Quadratic Expressions", "Trigonometry Basics", "Probability", "Mensuration"],
    shs1: ["Sets and Operations", "Real Number System", "Algebraic Processes", "Plane Geometry", "Statistics I"],
    shs2: ["Trigonometry", "Indices and Logarithms", "Sequences and Series", "Coordinate Geometry", "Vectors"],
    shs3: ["Calculus Basics", "Permutations & Combinations", "Statistics II", "Logic & Proofs", "Matrices"],
  },
  science: {
    jhs1: ["Living and Non-living Things", "The Human Body", "Matter and Materials", "Energy Forms", "The Environment"],
    jhs2: ["Cells and Organisms", "Mixtures and Solutions", "Force and Motion", "Electricity Basics", "Reproduction"],
    jhs3: ["Chemical Reactions", "Ecosystems", "Light and Sound", "Acids, Bases & Salts", "Diseases and Prevention"],
    shs1: ["Cell Biology", "Ecology", "Atomic Structure", "Mechanics", "Organic Chemistry Intro"],
    shs2: ["Genetics", "Chemical Bonding", "Waves", "Electromagnetism", "Thermodynamics"],
    shs3: ["Evolution", "Electrochemistry", "Nuclear Physics", "Biotechnology", "Environmental Science"],
  },
  english: {
    jhs1: ["Parts of Speech", "Sentence Construction", "Comprehension", "Vocabulary Building", "Creative Writing Basics"],
    jhs2: ["Tenses", "Direct & Indirect Speech", "Essay Writing", "Summary Skills", "Literature Appreciation"],
    jhs3: ["Clauses & Phrases", "Argumentative Writing", "Formal Letter Writing", "Comprehension & Summary", "Oral English"],
    shs1: ["Advanced Grammar", "Narrative Essay", "Poetry Analysis", "Comprehension Strategies", "Speech Writing"],
    shs2: ["Literary Criticism", "Expository Writing", "Drama Study", "Advanced Vocabulary", "Research Skills"],
    shs3: ["Prose & Fiction Analysis", "Persuasive Writing", "Sociolinguistics", "Advanced Composition", "Exam Techniques"],
  },
  social: {
    jhs1: ["Our Community", "Ghana's Geography", "Family Systems", "National Symbols", "Basic Governance"],
    jhs2: ["Pre-colonial Ghana", "Ethnic Groups", "Economic Activities", "Map Reading", "Citizenship"],
    jhs3: ["Colonial History", "Independence & Nationhood", "Government Structure", "Trade & Industry", "Human Rights"],
    shs1: ["Ghana's Constitution", "African Civilizations", "Population Studies", "Economic Development", "International Relations Intro"],
    shs2: ["Globalisation", "Environmental Issues", "Governance Systems", "Migration", "Conflict Resolution"],
    shs3: ["Contemporary Issues", "Regional Integration", "Law & Justice", "Development Planning", "Democracy"],
  },
  ict: {
    jhs1: ["Introduction to Computers", "Input & Output Devices", "Computer Safety", "Basic Word Processing", "Internet Awareness"],
    jhs2: ["Operating Systems", "Spreadsheet Basics", "File Management", "Email Usage", "Digital Citizenship"],
    jhs3: ["Database Concepts", "Presentation Software", "Internet Research", "Computer Networks", "Coding Basics"],
    shs1: ["Hardware & Software", "Advanced Word Processing", "Number Systems", "Introduction to Programming", "Web Basics"],
    shs2: ["Algorithms & Flowcharts", "Database Management", "Networking Concepts", "Web Design", "Cybersecurity"],
    shs3: ["Programming (Python/C)", "Systems Analysis", "AI & Emerging Tech", "Project Management", "IT Ethics"],
  },
};

const questionDistributions = [
  { label: "Balanced Mix", value: "balanced", desc: "MCQ, Short Answer & Essay" },
  { label: "Objective Only", value: "objective", desc: "Multiple choice questions" },
  { label: "Theory Only", value: "theory", desc: "Short answer & essay" },
];

interface GenerateTabProps {
  onQuestionsGenerated: (questions: ParsedQuestion[]) => void;
}

export function GenerateTab({ onQuestionsGenerated }: GenerateTabProps) {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState("10");
  const [distribution, setDistribution] = useState("balanced");
  const [difficulty, setDifficulty] = useState("medium");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [generating, setGenerating] = useState(false);

  const availableTopics = subject && grade ? syllabusTopics[subject]?.[grade] || [] : [];

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleGenerate = () => {
    if (!subject || !grade) {
      toast.error("Please select a subject and grade level");
      return;
    }
    if (selectedTopics.length === 0) {
      toast.error("Please select at least one syllabus topic");
      return;
    }

    setGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
      const count = parseInt(questionCount) || 10;
      const generated: ParsedQuestion[] = [];
      let id = 1;

      const topicPool = selectedTopics.length > 0 ? selectedTopics : availableTopics;

      for (let i = 0; i < count; i++) {
        const topic = topicPool[i % topicPool.length];

        if (distribution === "objective" || (distribution === "balanced" && i % 3 < 2)) {
          generated.push({
            id: id++,
            type: "mcq",
            text: `[${topic}] Which of the following best describes a key concept in ${topic.toLowerCase()}?`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            answer: "Option B",
            marks: 2,
          });
        } else if (distribution === "theory" || (distribution === "balanced" && i % 3 === 2)) {
          if (i % 2 === 0) {
            generated.push({
              id: id++,
              type: "short",
              text: `[${topic}] Define and explain one major principle related to ${topic.toLowerCase()}.`,
              answer: "Sample expected answer",
              marks: 4,
            });
          } else {
            generated.push({
              id: id++,
              type: "essay",
              text: `[${topic}] Discuss the significance of ${topic.toLowerCase()} in the Ghanaian context. Provide relevant examples.`,
              marks: 10,
            });
          }
        }
      }

      setGenerating(false);
      onQuestionsGenerated(generated);
      toast.success(`${generated.length} questions generated from GES syllabus!`);
    }, 2500);
  };

  return (
    <div className="rounded-2xl border bg-card p-6 space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-full bg-secondary/15 p-2.5">
          <Sparkles className="h-5 w-5 text-secondary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Generate from GES Syllabus</h3>
          <p className="text-xs text-muted-foreground">AI creates questions aligned with Ghana Education Service standards</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
            Subject
          </Label>
          <Select value={subject} onValueChange={(v) => { setSubject(v); setSelectedTopics([]); }}>
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
          <Select value={grade} onValueChange={(v) => { setGrade(v); setSelectedTopics([]); }}>
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
      </div>

      {availableTopics.length > 0 && (
        <div className="space-y-2">
          <Label>Syllabus Topics <span className="text-muted-foreground font-normal">(select one or more)</span></Label>
          <div className="flex flex-wrap gap-2">
            {availableTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => toggleTopic(topic)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors active:scale-[0.96] ${
                  selectedTopics.includes(topic)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
          {selectedTopics.length > 0 && (
            <p className="text-xs text-primary font-medium">{selectedTopics.length} topic{selectedTopics.length > 1 ? "s" : ""} selected</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>No. of Questions</Label>
          <Input
            type="number"
            min="1"
            max="50"
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Question Type</Label>
          <Select value={distribution} onValueChange={setDistribution}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {questionDistributions.map((d) => (
                <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
              <SelectItem value="mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Additional Instructions <span className="text-muted-foreground font-normal">(optional)</span></Label>
        <Textarea
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          placeholder="e.g. Focus on real-world applications, include diagrams descriptions, avoid repeated concepts..."
          rows={2}
        />
      </div>

      <Button onClick={handleGenerate} disabled={generating || !subject || !grade || selectedTopics.length === 0} className="w-full gap-2">
        {generating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating from syllabus...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate Questions
          </>
        )}
      </Button>
    </div>
  );
}
