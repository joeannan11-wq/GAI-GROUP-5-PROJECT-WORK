import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface School {
  id: string;
  name: string;
  region: string;
  type: string;
}

export function useSchools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("schools" as any)
        .select("id, name, region, type")
        .order("name");
      if (!error && data) setSchools(data as any[]);
      setLoading(false);
    };
    fetch();
  }, []);

  return { schools, loading };
}
