import { useState } from "react";
import { Search, Settings, Plus, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme } from "@/hooks/use-theme";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, Loader2, CheckCircle2, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTaskSchema, type InsertTask } from "@shared/schema";
import { useEffect } from "react";

function WeeklyCalendar({ selectedDate, onSelectDate }: any) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="bg-card rounded-lg p-4 border border-card-border">
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={cn(
                "flex flex-col items-center p-2 rounded-lg transition-all hover-elevate active-elevate-2",
                isSelected && "bg-primary text-primary-foreground"
              )}
              data-testid={`button-date-${format(day, "yyyy-MM-dd")}`}
            >
              <span className="text-xs font-medium mb-1">
                {format(day, "EEE")}
              </span>
              <span
                className={cn(
                  "text-lg font-semibold w-8 h-8 flex items-center justify-center rounded-full",
                  isToday && !isSelected && "bg-primary/10"
                )}
              >
                {format(day, "d")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TaskCard({ task, onToggle, onEdit, onDelete }: any) {
  return (
    <div className="bg-card border border-card-border rounded-lg p-4 hover-elevate" data-testid={`card-task-${task.id}`}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={(checked) => onToggle(checked as boolean)}
          className="mt-1"
          data-testid={`checkbox-task-${task.id}`}
        />

        <div className="flex-1 min-w-0">
          <h3 className={cn("text-base font-medium text-foreground mb-1", task.completed && "line-through text-muted-foreground")} data-testid={`text-task-title-${task.id}`}>
            {task.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2" data-testid={`text-task-time-${task.id}`}>
            {task.startTime} - {task.endTime}
          </p>
          {task.description && (
            <p className={cn("text-sm text-muted-foreground", task.completed && "line-through")} data-testid={`text-task-description-${task.id}`}>
              {task.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8" data-testid={`button-edit-task-${task.id}`}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-destructive hover:text-destructive" data-testid={`button-delete-task-${task.id}`}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function TaskList({ selectedDate, searchQuery, onEditTask }: any) {
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
      return task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.description?.toLowerCase().includes(searchQuery.toLowerCase());
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
          <p className="text-muted-foreground">{searchQuery ? "No tasks found" : "No tasks for today"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={(completed: boolean) => toggleTaskMutation.mutate({ id: task.id, completed })}
              onEdit={() => onEditTask(task.id)}
              onDelete={() => deleteTaskMutation.mutate(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WeeklyProgress({ selectedDate }: any) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekEnd = addDays(weekStart, 6);

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

function TaskModal({ open, onOpenChange, defaultDate, editingTaskId }: any) {
  const { data: editingTask } = useQuery<Task>({
    queryKey: ["/api/tasks/:id", editingTaskId],
    queryFn: async () => {
      const response = await fetch(`/api/tasks/${editingTaskId}`);
      if (!response.ok) throw new Error("Failed to fetch task");
      return response.json();
    },
    enabled: !!editingTaskId,
  });

  const form = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      date: defaultDate || format(new Date(), "yyyy-MM-dd"),
      startTime: "09:00",
      endTime: "10:00",
      completed: false,
    },
  });

  useEffect(() => {
    if (editingTask) {
      form.reset({
        title: editingTask.title,
        description: editingTask.description || "",
        date: editingTask.date,
        startTime: editingTask.startTime,
        endTime: editingTask.endTime,
        completed: editingTask.completed,
      });
    } else if (!editingTaskId) {
      form.reset({
        title: "",
        description: "",
        date: defaultDate || format(new Date(), "yyyy-MM-dd"),
        startTime: "09:00",
        endTime: "10:00",
        completed: false,
      });
    }
  }, [editingTask, editingTaskId, defaultDate, form]);

  const createTaskMutation = useMutation({
    mutationFn: async (data: InsertTask) => {
      return apiRequest("POST", "/api/tasks", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "/api/tasks" || (typeof query.queryKey[0] === "string" && query.queryKey[0].startsWith("/api/tasks")) });
      onOpenChange(false);
      form.reset();
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (data: Partial<InsertTask>) => {
      return apiRequest("PATCH", `/api/tasks/${editingTaskId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "/api/tasks" || (typeof query.queryKey[0] === "string" && query.queryKey[0].startsWith("/api/tasks")) });
      onOpenChange(false);
      form.reset();
    },
  });

  const onSubmit = (data: InsertTask) => {
    if (editingTaskId) {
      const { completed, ...updateData } = data;
      updateTaskMutation.mutate(updateData);
    } else {
      createTaskMutation.mutate(data);
    }
  };

  const isPending = createTaskMutation.isPending || updateTaskMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingTaskId ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task title</FormLabel>
                  <FormControl>
                    <Input placeholder="Doing Homework" {...field} data-testid="input-task-title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Set Date</FormLabel>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")} data-testid="button-date-picker">
                    {field.value ? format(new Date(field.value), "EEEE, dd MMMM") : "Pick a date"}
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} data-testid="input-start-time" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ends</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} data-testid="input-end-time" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add Description" className="resize-none" rows={3} {...field} data-testid="input-task-description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending} data-testid="button-save-task">
              {isPending ? "Saving..." : editingTaskId ? "Update task" : "Create task"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  const handleEditTask = (taskId: string) => {
    setEditingTaskId(taskId);
    setIsTaskModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsTaskModalOpen(false);
    setEditingTaskId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {!showSearch ? (
        <header className="border-b border-border bg-background sticky top-0 z-50">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">Home</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
                data-testid="button-search"
              >
                <Search className="w-5 h-5" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    data-testid="button-settings"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48" align="end">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground text-sm">Theme</h3>
                    <div className="flex gap-2">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleTheme("light")}
                        className="flex-1 gap-2"
                        data-testid="button-light-mode"
                      >
                        <Sun className="w-4 h-4" />
                        Light
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleTheme("dark")}
                        className="flex-1 gap-2"
                        data-testid="button-dark-mode"
                      >
                        <Moon className="w-4 h-4" />
                        Dark
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </header>
      ) : (
        <header className="border-b border-border bg-background sticky top-0 z-50">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <Input
              type="search"
              placeholder="Search for a task"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              onBlur={() => {
                if (!searchQuery) setShowSearch(false);
              }}
              className="w-full"
              data-testid="input-search"
            />
          </div>
        </header>
      )}

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
        <WeeklyCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <TaskList
              selectedDate={selectedDate}
              searchQuery={searchQuery}
              onEditTask={handleEditTask}
            />
          </div>
          <div className="md:col-span-2">
            <WeeklyProgress selectedDate={selectedDate} />
          </div>
        </div>
      </main>

      <Button
        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full shadow-lg"
        size="icon"
        onClick={() => setIsTaskModalOpen(true)}
        data-testid="button-add-task"
      >
        <Plus className="w-6 h-6" />
      </Button>

      <TaskModal
        open={isTaskModalOpen}
        onOpenChange={handleCloseModal}
        defaultDate={format(selectedDate, "yyyy-MM-dd")}
        editingTaskId={editingTaskId}
      />
    </div>
  );
}
