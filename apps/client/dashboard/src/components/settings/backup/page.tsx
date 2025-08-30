import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/use-profile";
import { toast } from "sonner";

export function SettingsBackupPage() {
  const { rawProfile } = useProfile();

  function downloadBackup() {
    const blob = new Blob([JSON.stringify(rawProfile)], {
      type: "application/json",
      endings: "native",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `monyfox-backup-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
    toast.success("Backup downloaded successfully.");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <div>
            <CardTitle>Backup</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button className="w-full" onClick={downloadBackup}>
          Download backup
        </Button>
      </CardContent>
    </Card>
  );
}
