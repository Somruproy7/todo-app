import { useState } from "react";
import { Search, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WeeklyCalendar } from "@/components/weekly-calendar";
import { TaskList } from "@/components/task-list";
import { WeeklyProgress } from "@/components/weekly-progress";
import { TaskModal } from "@/components/task-modal";
import { format } from "date-fns";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

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
              <Button
                variant="ghost"
                size="icon"
                data-testid="button-settings"
              >
                <Settings className="w-5 h-5" />
              </Button>
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
