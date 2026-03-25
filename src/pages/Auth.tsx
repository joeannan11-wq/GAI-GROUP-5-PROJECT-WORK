import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Loader2, GraduationCap, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = loginSchema.extend({
  fullName: z.string().trim().min(1, "Full name is required").max(100),
  role: z.enum(["teacher", "student"]),
  school: z.string().trim().min(1, "School name is required").max(200),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"teacher" | "student">("teacher");
  const [school, setSchool] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const parsed = loginSchema.parse({ email, password });
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.email,
          password: parsed.password,
        });
        if (error) throw error;
      } else {
        const parsed = signupSchema.parse({ email, password, fullName, role, school });
        const { error } = await supabase.auth.signUp({
          email: parsed.email,
          password: parsed.password,
          options: {
            data: { full_name: parsed.fullName, role: parsed.role, school: parsed.school },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({
          title: "Check your email",
          description: "We sent you a verification link. Please confirm your email before signing in.",
        });
        setIsLogin(true);
        setLoading(false);
        return;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md animate-reveal-up" style={{ animationDelay: "100ms" }}>
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Zap className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">THRIVE AFRICA'S TUTOR</h1>
            <p className="text-sm text-muted-foreground">AI-Powered Examination Platform</p>
          </div>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg">{isLogin ? "Welcome back" : "Create your account"}</CardTitle>
            <CardDescription>
              {isLogin ? "Sign in to access your dashboard" : "Sign up as a teacher or student"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  {/* Role selector */}
                  <div className="space-y-2">
                    <Label>I am a</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole("teacher")}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all",
                          role === "teacher"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/30"
                        )}
                      >
                        <BookOpen className="h-4 w-4" />
                        Teacher
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("student")}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all",
                          role === "student"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/30"
                        )}
                      >
                        <GraduationCap className="h-4 w-4" />
                        Student
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Ama Koranteng"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="school">School Name</Label>
                    <Input
                      id="school"
                      placeholder="e.g. Accra Academy"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      required
                      maxLength={200}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@school.edu.gh"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={255}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
