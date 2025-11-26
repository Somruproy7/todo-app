import { Task } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onToggle: (completed: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  return (
    <div
      className="bg-card border border-card-border rounded-lg p-4 hover-elevate"
      data-testid={`card-task-${task.id}`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={(checked) => onToggle(checked as boolean)}
          className="mt-1"
          data-testid={`checkbox-task-${task.id}`}
        />

        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "text-base font-medium text-foreground mb-1",
              task.completed && "line-through text-muted-foreground"
            )}
            data-testid={`text-task-title-${task.id}`}
          >
            {task.title}
          </h3>

          <p className="text-sm text-muted-foreground mb-2" data-testid={`text-task-time-${task.id}`}>
            {task.startTime} - {task.endTime}
          </p>

          {task.description && (
            <p
              className={cn(
                "text-sm text-muted-foreground",
                task.completed && "line-through"
              )}
              data-testid={`text-task-description-${task.id}`}
            >
              {task.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8"
            data-testid={`button-edit-task-${task.id}`}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-destructive hover:text-destructive"
            data-testid={`button-delete-task-${task.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
