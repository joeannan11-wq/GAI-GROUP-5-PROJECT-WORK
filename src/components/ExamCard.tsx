import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

interface ExamCardProps {
  title: string;
  subject: string;
  grade: string;
  status: "draft" | "active" | "completed" | "graded";
  studentCount: number;
  duration: string;
  deadline?: string;
  className?: string;
  delay?: number;
}

const statusConfig = {
  draft: { label: "Draft", class: "bg-muted text-muted-foreground" },
  active: { label: "Active", class: "bg-info/15 text-info" },
  completed: { label: "Completed", class: "bg-warning/15 text-warning" },
  graded: { label: "Graded", class: "bg-success/15 text-success" },
};

export function ExamCard({ title, subject, grade, status, studentCount, duration, deadline, className, delay = 0 }: ExamCardProps) {
  const sc = statusConfig[status];

  return (
    <div
      className={cn(
        "animate-reveal-up group cursor-pointer rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors truncate">{title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{subject} · {grade}</p>
        </div>
        <Badge className={cn("shrink-0 rounded-full text-xs font-medium border-0", sc.class)}>
          {sc.label}
        </Badge>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" />
          {studentCount} students
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {duration}
        </span>
      </div>
      {deadline && (
        <p className="mt-2 text-xs text-muted-foreground">
          Deadline: {deadline}
        </p>
      )}
    </div>
  );
}
