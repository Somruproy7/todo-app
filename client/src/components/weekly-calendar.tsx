import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

interface WeeklyCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function WeeklyCalendar({ selectedDate, onSelectDate }: WeeklyCalendarProps) {
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

export { WeeklyCalendar };
