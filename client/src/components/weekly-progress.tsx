import { useQuery } from "@tanstack/react-query";
import { startOfWeek, endOfWeek, format } from "date-fns";
import { Task } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle } from "lucide-react";

interface WeeklyProgressProps {
  selectedDate: Date;
}

export function WeeklyProgress({ selectedDate }: WeeklyProgressProps) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });

  const { data: stats } = useQuery<{ completed: number; pending: number; total: number }>({
    queryKey: ["/api/tasks/stats", format(weekStart, "yyyy-MM-dd"), format(weekEnd, "yyyy-MM-dd")],
    queryFn: async () => {
      const response = await fetch(`/api/tasks/stats?startDate=${format(weekStart, "yyyy-MM-dd")}&endDate=${format(weekEnd, "yyyy-MM-dd")}`);
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  const completedCount = stats?.completed ?? 0;
  const pendingCount = stats?.pending ?? 0;
  const totalCount = stats?.total ?? 0;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-card border border-card-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Progress</h3>

      <div className="space-y-4">
        <Progress value={progressPercentage} className="h-2" />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
            <div className="bg-primary/10 p-2 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Task Complete</p>
              <p className="text-2xl font-bold text-foreground" data-testid="text-completed-count">
                {completedCount}
              </p>
              <p className="text-xs text-muted-foreground">This Week</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-destructive/5 rounded-lg">
            <div className="bg-destructive/10 p-2 rounded-full">
              <Circle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Task Pending</p>
              <p className="text-2xl font-bold text-foreground" data-testid="text-pending-count">
                {pendingCount}
              </p>
              <p className="text-xs text-muted-foreground">This Week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
