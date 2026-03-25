import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, GraduationCap, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamWithStatus {
  id: string;
  title: string;
  subject: string;
  grade: string;
  deadline: string | null;
  is_active: boolean;
  submission_status: string | null;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const { school } = useUserRole();
  const navigate = useNavigate();
  const [exams, setExams] = useState<ExamWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !school) return;

    const fetchExams = async () => {
      setLoading(true);
      // Fetch active exams for the student's school
      const { data: examData } = await supabase
        .from("published_exams")
        .select("id, title, subject, grade, deadline, is_active")
        .eq("is_active", true)
        .eq("school", school);

      if (!examData) {
        setLoading(false);
        return;
      }

      // Fetch student's submissions
      const { data: submissions } = await supabase
        .from("student_submissions")
        .select("exam_id, status")
        .eq("student_id", user.id);

      const submissionMap = new Map(submissions?.map((s) => [s.exam_id, s.status]) ?? []);

      setExams(
        examData.map((exam) => ({
          ...exam,
          submission_status: submissionMap.get(exam.id) ?? null,
        }))
      );
      setLoading(false);
    };

    fetchExams();
  }, [user, school]);

  const availableExams = exams.filter((e) => !e.submission_status || e.submission_status === "in_progress");
  const completedExams = exams.filter((e) => e.submission_status === "submitted" || e.submission_status === "graded");

  return (
    <AppLayout>
      <div className="animate-reveal-up">
        <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back! Browse and take exams published for{" "}
          <span className="font-medium text-foreground">{school || "your school"}</span>.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4 animate-reveal-up stagger-1">
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2.5">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{availableExams.length}</p>
              <p className="text-sm text-muted-foreground">Available Exams</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-warning/10 p-2.5">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {exams.filter((e) => e.submission_status === "in_progress").length}
              </p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-success/10 p-2.5">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{completedExams.length}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Exams */}
      <div className="mt-10 animate-reveal-up stagger-2">
        <h2 className="text-lg font-semibold text-foreground">Available Exams</h2>
        {loading ? (
          <div className="mt-4 flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : availableExams.length === 0 ? (
          <div className="mt-4 rounded-xl border-2 border-dashed border-border py-12 text-center">
            <GraduationCap className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">No exams available for your school right now.</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {availableExams.map((exam) => (
              <div
                key={exam.id}
                className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{exam.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {exam.subject} · {exam.grade}
                    </p>
                    {exam.deadline && (
                      <p className="mt-2 text-xs text-warning">
                        <Clock className="mr-1 inline h-3 w-3" />
                        Deadline: {new Date(exam.deadline).toLocaleString()}
                      </p>
                    )}
                  </div>
                  {exam.submission_status === "in_progress" && (
                    <Badge className="bg-warning/15 text-warning border-0">In Progress</Badge>
                  )}
                </div>
                <Button
                  className="mt-4 w-full"
                  onClick={() => navigate(`/take-exam/${exam.id}`)}
                >
                  {exam.submission_status === "in_progress" ? "Continue Exam" : "Start Exam"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Exams */}
      {completedExams.length > 0 && (
        <div className="mt-10 animate-reveal-up stagger-3">
          <h2 className="text-lg font-semibold text-foreground">Completed Exams</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {completedExams.map((exam) => (
              <div key={exam.id} className="rounded-xl border bg-card p-5 opacity-80">
                <h3 className="font-semibold text-foreground">{exam.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {exam.subject} · {exam.grade}
                </p>
                <Badge className={cn(
                  "mt-3 border-0",
                  exam.submission_status === "graded"
                    ? "bg-success/15 text-success"
                    : "bg-muted text-muted-foreground"
                )}>
                  {exam.submission_status === "graded" ? "Graded" : "Submitted"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
