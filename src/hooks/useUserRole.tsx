import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type AppRole = "admin" | "teacher" | "student";

export function useUserRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [school, setSchool] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setSchool(null);
      setLoading(false);
      return;
    }

    const fetchRoleAndProfile = async () => {
      setLoading(true);
      const [roleRes, profileRes] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle(),
        supabase.from("profiles").select("school").eq("id", user.id).maybeSingle(),
      ]);

      setRole((roleRes.data?.role as AppRole) ?? "teacher");
      setSchool(profileRes.data?.school ?? null);
      setLoading(false);
    };

    fetchRoleAndProfile();
  }, [user]);

  return { role, school, loading };
}
