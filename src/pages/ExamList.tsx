import { AppLayout } from "@/components/AppLayout";
import { ExamCard } from "@/components/ExamCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const exams = [
  { title: "Mid-Term Mathematics", subject: "Mathematics", grade: "JHS 3", status: "active" as const, studentCount: 42, duration: "2 hrs", deadline: "Mar 25, 2026 · 2:00 PM" },
  { title: "Science Weekly Quiz", subject: "Integrated Science", grade: "SHS 1", status: "graded" as const, studentCount: 38, duration: "45 min" },
  { title: "English Language Essay", subject: "English", grade: "JHS 2", status: "completed" as const, studentCount: 45, duration: "1 hr 30 min" },
  { title: "Social Studies Test", subject: "Social Studies", grade: "SHS 2", status: "draft" as const, studentCount: 0, duration: "1 hr" },
  { title: "ICT Practical Exam", subject: "ICT", grade: "SHS 1", status: "graded" as const, studentCount: 36, duration: "1 hr" },
  { title: "Mathematics Quiz 3", subject: "Mathematics", grade: "JHS 1", status: "graded" as const, studentCount: 40, duration: "30 min" },
];

export default function ExamList() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="animate-reveal-up flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Exams</h1>
          <p className="mt-1 text-muted-foreground">{exams.length} exams created</p>
        </div>
        <Button onClick={() => navigate("/create-exam")} className="gap-2">
          <Plus className="h-4 w-4" />
          New Exam
        </Button>
      </div>

      <div className="mt-6 animate-reveal-up stagger-1">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search exams..." className="pl-9" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {exams.map((exam, i) => (
          <ExamCard key={exam.title} {...exam} delay={160 + i * 80} />
        ))}
      </div>
    </AppLayout>
  );
}
