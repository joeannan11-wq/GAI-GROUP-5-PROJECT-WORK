import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="animate-reveal-up">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account and exam preferences.</p>
      </div>

      <div className="mt-8 max-w-xl space-y-8 animate-reveal-up stagger-1">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Profile</h2>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input defaultValue="Ama Koranteng" />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input defaultValue="ama.koranteng@school.gh" />
            </div>
            <div className="space-y-1.5">
              <Label>School</Label>
              <Input defaultValue="Achimota Senior High School" />
            </div>
          </div>
        </section>

        <hr className="border-border" />

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Exam Defaults</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Randomize Questions</p>
                <p className="text-xs text-muted-foreground">Shuffle question order for each student</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Allow Grace Period</p>
                <p className="text-xs text-muted-foreground">5 extra minutes after deadline</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Auto-publish Results</p>
                <p className="text-xs text-muted-foreground">Publish grades immediately after AI marking</p>
              </div>
              <Switch />
            </div>
          </div>
        </section>

        <Button className="mt-4">Save Changes</Button>
      </div>
    </AppLayout>
  );
}
