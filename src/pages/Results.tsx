import { AppLayout } from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { BarChart3, Download, TrendingUp, Users, Award } from "lucide-react";

const students = [
  { name: "Kwame Asante", score: 92, grade: "A1", rank: 1 },
  { name: "Abena Mensah", score: 87, grade: "A1", rank: 2 },
  { name: "Kofi Boateng", score: 78, grade: "B2", rank: 3 },
  { name: "Esi Owusu", score: 74, grade: "B3", rank: 4 },
  { name: "Yaw Adjei", score: 68, grade: "C4", rank: 5 },
  { name: "Akua Darko", score: 65, grade: "C5", rank: 6 },
  { name: "Nana Appiah", score: 58, grade: "C6", rank: 7 },
  { name: "Adjoa Poku", score: 52, grade: "D7", rank: 8 },
  { name: "Kwesi Amoah", score: 45, grade: "E8", rank: 9 },
  { name: "Efua Takyi", score: 38, grade: "F9", rank: 10 },
];

const gradeDistribution = [
  { grade: "A1", count: 2, pct: 20 },
  { grade: "B2-B3", count: 2, pct: 20 },
  { grade: "C4-C6", count: 3, pct: 30 },
  { grade: "D7", count: 1, pct: 10 },
  { grade: "E8", count: 1, pct: 10 },
  { grade: "F9", count: 1, pct: 10 },
];

function gradeColor(grade: string) {
  if (grade.startsWith("A")) return "text-success bg-success/10";
  if (grade.startsWith("B")) return "text-info bg-info/10";
  if (grade.startsWith("C")) return "text-secondary bg-secondary/15";
  if (grade.startsWith("D")) return "text-warning bg-warning/15";
  return "text-destructive bg-destructive/10";
}

export default function Results() {
  return (
    <AppLayout>
      <div className="animate-reveal-up flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Results</h1>
          <p className="mt-1 text-muted-foreground">Mid-Term Mathematics · JHS 3</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="midterm-math">
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="midterm-math">Mid-Term Mathematics</SelectItem>
              <SelectItem value="science-quiz">Science Weekly Quiz</SelectItem>
              <SelectItem value="english-essay">English Language Essay</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-4 gap-4">
        <StatCard icon={Users} label="Submissions" value="42/42" change="100% completion" changeType="positive" delay={80} />
        <StatCard icon={TrendingUp} label="Average Score" value="65.7%" change="+4.2% vs last test" changeType="positive" delay={160} />
        <StatCard icon={Award} label="Highest Score" value="92%" change="Kwame Asante" changeType="neutral" delay={240} />
        <StatCard icon={BarChart3} label="Pass Rate" value="70%" change="7 of 10 passed" changeType="positive" delay={320} />
      </div>

      {/* Grade Distribution */}
      <div className="mt-10 animate-reveal-up" style={{ animationDelay: "380ms" }}>
        <h2 className="text-lg font-semibold text-foreground">Grade Distribution</h2>
        <div className="mt-4 flex items-end gap-3 h-32">
          {gradeDistribution.map((g) => (
            <div key={g.grade} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground">{g.count}</span>
              <div
                className="w-full rounded-t-md bg-primary/80 transition-all duration-500"
                style={{ height: `${g.pct * 1.2}%`, minHeight: 8 }}
              />
              <span className="text-xs text-muted-foreground">{g.grade}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Student Table */}
      <div className="mt-10 animate-reveal-up" style={{ animationDelay: "450ms" }}>
        <h2 className="text-lg font-semibold text-foreground">Student Scores</h2>
        <div className="mt-4 overflow-hidden rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rank</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Student</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Score</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Grade</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.name} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 tabular-nums text-muted-foreground">{s.rank}</td>
                  <td className="px-4 py-3 font-medium text-card-foreground">{s.name}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-card-foreground">{s.score}%</td>
                  <td className="px-4 py-3 text-center">
                    <Badge className={cn("rounded-full border-0 text-xs font-semibold", gradeColor(s.grade))}>
                      {s.grade}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
