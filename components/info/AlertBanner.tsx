import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import data from "@/data/company-info.json";

export function AlertBanner() {
  if (!data.alerts || data.alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {data.alerts.map((alert) => (
        <Alert key={alert.id} variant={alert.type as any} className="bg-destructive/5 border-destructive/20 border-l-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-sm font-bold">{alert.title} —</AlertTitle>
          <AlertDescription className="text-xs">
            {alert.message}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
