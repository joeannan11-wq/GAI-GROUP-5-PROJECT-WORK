import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Search, ExternalLink, Clock, BookOpen, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PublishedExam {
  id: string;
  title: string;
  subject: string;
  grade: string;
  google_form_url: string;
  deadline: string | null;
  is_active: boolean;
}

export default function StudentExamAccess() {
  const [accessCode, setAccessCode] = useState("");
  const [exam, setExam] = useState<PublishedExam | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) return;
    setLoading(true);
    setSearched(true);

    const { data, error } = await supabase
      .from("published_exams")
      .select("id, title, subject, grade, google_form_url, deadline, is_active")
      .eq("access_code", accessCode.trim().toUpperCase())
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) {
      setExam(null);
      toast({
        title: "Exam not found",
        description: "Check the access code and try again.",
        variant: "destructive",
      });
    } else {
      setExam(data);
    }
    setLoading(false);
  };

  const isExpired = exam?.deadline ? new Date(exam.deadline) < new Date() : false;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg animate-reveal-up">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Zap className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground"><h1 className="text-xl font-bold text-foreground">AI-POWERED STUDENT DIAGNOSTIC & FEEDBACK</h1></h1>
            <p className="text-sm text-muted-foreground">Student Exam Portal</p>
          </div>
        </div>

        {/* Search */}
        <Card className="border-border shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg">Access Your Exam</CardTitle>
            <CardDescription>
              Enter the access code provided by your teacher
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="code" className="sr-only">Access Code</Label>
                <Input
                  id="code"
                  placeholder="e.g. MATH-JHS3-2026"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="text-center font-mono tracking-wider uppercase"
                  maxLength={30}
                />
              </div>
              <Button type="submit" disabled={loading} className="gap-2">
                <Search className="h-4 w-4" />
                Find
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Exam Result */}
        {exam && (
          <Card className="mt-6 border-border shadow-lg animate-reveal-up" style={{ animationDelay: "100ms" }}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <h2 className="text-lg font-semibold text-foreground">{exam.title}</h2>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" /> {exam.subject}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4" /> {exam.grade}
                    </span>
                    {exam.deadline && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        Due: {new Date(exam.deadline).toLocaleDateString("en-GH", {
                          month: "short", day: "numeric", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {isExpired ? (
                <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive font-medium">
                  This exam's deadline has passed. Contact your teacher.
                </div>
              ) : (
                <Button
                  className="mt-4 w-full gap-2"
                  onClick={() => window.open(exam.google_form_url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Exam in Google Forms
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {searched && !exam && !loading && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            No active exam found with that code. Double-check and try again.
          </p>
        )}

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Are you a teacher?{" "}
          <a href="/" className="text-primary hover:underline">Sign in here</a>
        </p>
      </div>
    </div>
  );
}
