import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Task } from "@shared/schema";
import { TaskCard } from "@/components/task-card";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

interface TaskListProps {
  selectedDate: Date;
  searchQuery: string;
  onEditTask: (taskId: string) => void;
}

export default function TaskList({ selectedDate, searchQuery, onEditTask }: TaskListProps) {
  const dateString = format(selectedDate, "yyyy-MM-dd");

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks", { date: dateString }],
    queryFn: async () => {
      const response = await fetch(`/api/tasks?date=${dateString}`);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      return response.json();
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      return apiRequest("PATCH", `/api/tasks/${id}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "/api/tasks" || (typeof query.queryKey[0] === "string" && query.queryKey[0].startsWith("/api/tasks")) });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "/api/tasks" || (typeof query.queryKey[0] === "string" && query.queryKey[0].startsWith("/api/tasks")) });
    },
  });

  const filteredTasks = tasks.filter((task) => {
    if (searchQuery) {
      return task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">Tasks Today</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Tasks Today</h2>
        {filteredTasks.length > 0 && (
          <span className="text-sm text-muted-foreground" data-testid="text-task-count">
            {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
          </span>
        )}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery ? "No tasks found" : "No tasks for today"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={(completed) =>
                toggleTaskMutation.mutate({ id: task.id, completed })
              }
              onEdit={() => onEditTask(task.id)}
              onDelete={() => deleteTaskMutation.mutate(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export { TaskList };
