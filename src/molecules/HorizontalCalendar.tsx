import React, { useRef, useEffect } from "react";
import { addDays, format, isSameDay } from "date-fns";
import { DayChip } from "../atoms/ProjectTasksAtoms";

interface HorizontalCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  daysToShow?: number;
}

const HorizontalCalendar: React.FC<HorizontalCalendarProps> = ({
  selectedDate,
  onSelectDate,
  daysToShow = 14,
}) => {
  // Generate days (today and next daysToShow-1 days)
  const days = Array.from({ length: daysToShow }).map((_, i) =>
    addDays(new Date(), i)
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll selected date into view when it changes
  useEffect(() => {
    if (scrollRef.current) {
      const selectedElement = scrollRef.current.querySelector(
        '[data-selected="true"]'
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedDate]);

  return (
    <div className="bg-white px-4 py-2 border-b border-gray-100">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-3 pb-1 scrollbar-hide snap-x snap-mandatory"
      >
        {days.map((day) => (
          <div
            key={format(day, "yyyy-MM-dd")}
            className="snap-center flex-shrink-0"
            data-selected={isSameDay(day, selectedDate)}
          >
            <DayChip
              date={day}
              isActive={isSameDay(day, selectedDate)}
              onClick={() => onSelectDate(day)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalCalendar;
