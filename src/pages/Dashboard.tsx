import { AppLayout } from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { ExamCard } from "@/components/ExamCard";
import { Button } from "@/components/ui/button";
import { FileUp, ClipboardList, Users, CheckCircle2, TrendingUp, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const recentExams = [
{ title: "Mid-Term Mathematics", subject: "Mathematics", grade: "JHS 3", status: "active" as const, studentCount: 42, duration: "2 hrs", deadline: "Mar 25, 2026 · 2:00 PM" },
{ title: "Science Weekly Quiz", subject: "Integrated Science", grade: "SHS 1", status: "graded" as const, studentCount: 38, duration: "45 min" },
{ title: "English Language Essay", subject: "English", grade: "JHS 2", status: "completed" as const, studentCount: 45, duration: "1 hr 30 min" },
{ title: "Social Studies Test", subject: "Social Studies", grade: "SHS 2", status: "draft" as const, studentCount: 0, duration: "1 hr" }];


export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      {/* Header */}
      <div className="animate-reveal-up flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, Ama</h1>
          <p className="mt-1 text-muted-foreground">Here's what's happening with your exams today.</p>
        </div>
        <Button onClick={() => navigate("/create-exam")} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Exam
        </Button>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-4 gap-4">
        <StatCard icon={ClipboardList} label="Total Exams" value={24} change="+3 this month" changeType="positive" delay={80} />
        <StatCard icon={Users} label="Total Students" value={186} change="+12 this week" changeType="positive" delay={160} />
        <StatCard icon={CheckCircle2} label="Graded" value={18} change="75% completion" changeType="neutral" delay={240} />
        <StatCard icon={TrendingUp} label="Avg. Score" value="67.4%" change="+2.1% vs last term" changeType="positive" delay={320} />
      </div>

      {/* Recent Exams */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground animate-reveal-up" style={{ animationDelay: "350ms" }}>Recent Exams</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/exams")} className="text-muted-foreground animate-reveal-up" style={{ animationDelay: "350ms" }}>
            View all
          </Button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {recentExams.map((exam, i) =>
          <ExamCard key={exam.title} {...exam} delay={400 + i * 80} />
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-10 animate-reveal-up" style={{ animationDelay: "650ms" }}>
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/create-exam")}
            className="group flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border p-6 transition-all duration-200 hover:border-primary/40 active:scale-[0.97] bg-primary">
            
            <div className="rounded-full bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
              <FileUp className="h-5 w-5 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-card-foreground">Upload Questions</p>
              <p className="mt-0.5 text-xs text-muted-foreground">PDF or Word file</p>
            </div>
          </button>
          <button
            onClick={() => navigate("/results")}
            className="group flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border p-6 transition-all duration-200 hover:border-primary/40 active:scale-[0.97] bg-success">
            
            <div className="rounded-full bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-card-foreground">View Results</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Grades & analytics</p>
            </div>
          </button>
          <button
            onClick={() => navigate("/remarking")}
            className="group flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border p-6 transition-all duration-200 hover:border-primary/40 active:scale-[0.97] bg-destructive">
            
            <div className="rounded-full bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-card-foreground">Remarking Requests</p>
              <p className="mt-0.5 text-xs text-muted-foreground">3 pending reviews</p>
            </div>
          </button>
        </div>
      </div>
    </AppLayout>);

}