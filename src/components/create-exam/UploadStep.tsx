import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Upload, FileText, Zap } from "lucide-react";
import { toast } from "sonner";
import type { ParsedQuestion } from "./types";
import { sampleQuestions } from "./types";

interface UploadStepProps {
  onQuestionsReady: (questions: ParsedQuestion[]) => void;
}

export function UploadStep({ onQuestionsReady }: UploadStepProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);

  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
    setParsing(true);
    setTimeout(() => {
      setParsing(false);
      onQuestionsReady(sampleQuestions);
      toast.success("5 questions extracted successfully!");
    }, 2000);
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-colors",
        file ? "border-primary/40 bg-primary/5" : "border-border bg-card"
      )}
    >
      {file ? (
        <>
          <div className="rounded-full bg-success/10 p-4">
            <FileText className="h-8 w-8 text-success" />
          </div>
          <p className="mt-4 text-sm font-semibold text-foreground">{file.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setFile(null)}>Remove</Button>
            <Button size="sm" onClick={handleUpload} disabled={parsing}>
              {parsing ? (
                <>
                  <Zap className="h-4 w-4 animate-pulse" />
                  Parsing with AI...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Extract Questions
                </>
              )}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-full bg-muted p-4">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="mt-4 text-sm font-semibold text-foreground">Upload exam questions</p>
          <p className="mt-1 text-xs text-muted-foreground">PDF or Word document · Max 10MB</p>
          <label className="mt-4">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <span className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.97]">
              <Upload className="h-4 w-4" />
              Choose File
            </span>
          </label>
        </>
      )}
    </div>
  );
}
