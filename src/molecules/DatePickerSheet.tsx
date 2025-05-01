import React, { useState } from 'react';
import { addMonths, subMonths, addDays, startOfMonth, endOfMonth, isWithinInterval, isBefore, isToday } from 'date-fns';
import { useTranslation } from 'react-i18next';
import useDateUtils from '../hooks/useDateUtils';

interface DatePickerSheetProps {
  onSelect: (date: string) => void;
  onClose: () => void;
  selectedDate: string | null;
  minDate?: string | null;
  maxDate?: string | null;
  title?: string;
}

const DatePickerSheet: React.FC<DatePickerSheetProps> = ({
  onSelect,
  onClose,
  selectedDate,
  minDate,
  maxDate,
  title = 'Select Date'
}) => {
  const { t } = useTranslation();
  const { parseFromYYYYMMDD, formatToYYYYMMDD, isSameDay, formatForDisplay, locale } = useDateUtils();
  // Pegar a string da localidade para uso com Intl API
  const localeString = locale.code || 'en-US';

  // Parse dates
  const parsedSelectedDate = selectedDate ? parseFromYYYYMMDD(selectedDate) : new Date();
  const parsedMinDate = minDate ? parseFromYYYYMMDD(minDate) : null;
  const parsedMaxDate = maxDate ? parseFromYYYYMMDD(maxDate) : null;

  // Current view state
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(parsedSelectedDate));

  // Generate days for the current month view
  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    
    // Get start of the week containing the first day
    let firstDay = start;
    while (firstDay.getDay() !== 0) { // 0 is Sunday
      firstDay = addDays(firstDay, -1);
    }
    
    // Generate all days to display
    const days = [];
    let day = firstDay;
    
    // Calculate the number of days to show based on the current month's start and end
    // We need to show complete weeks, so we include days until we reach at least the end of the month
    // plus enough days to complete the week containing the last day of the month
    const lastDayInView = addDays(end, 7 - end.getDay());
    const daysToShow = Math.round((lastDayInView.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    for (let i = 0; i < daysToShow; i++) {
      days.push(day);
      day = addDays(day, 1);
    }
    
    return days;
  };

  const days = getDaysInMonth();

  // Day selection handler
  const handleSelectDay = (day: Date) => {
    // Check if day is within allowed range
    if (parsedMinDate && isBefore(day, parsedMinDate)) {
      return;
    }
    
    if (parsedMaxDate && isBefore(parsedMaxDate, day)) {
      return;
    }
    
    onSelect(formatToYYYYMMDD(day));
    
    // Use setTimeout to ensure the state change occurs before closing
    setTimeout(() => {
      onClose();
    }, 100);
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  // Select today
  const selectToday = () => {
    const today = new Date();
    
    // Check if today is within allowed range
    if (parsedMinDate && isBefore(today, parsedMinDate)) {
      return;
    }
    
    if (parsedMaxDate && isBefore(parsedMaxDate, today)) {
      return;
    }
    
    onSelect(formatToYYYYMMDD(today));
    // Use setTimeout to ensure state updates before closing
    setTimeout(() => {
      onClose();
    }, 100);
  };

  // Day rendering with proper styling
  const renderDay = (day: Date) => {
    const isSelectedDay = selectedDate ? isSameDay(day, parseFromYYYYMMDD(selectedDate)) : false;
    const isInCurrentMonth = day.getMonth() === currentMonth.getMonth();
    const isTodayDate = isToday(day);
    
    const isDisabled = 
      (parsedMinDate && isBefore(day, parsedMinDate)) || 
      (parsedMaxDate && isBefore(parsedMaxDate, day));
    
    // Range check for visual styling
    const isInRange = !!parsedMinDate && !!parsedMaxDate ? 
      isWithinInterval(day, { start: parsedMinDate, end: parsedMaxDate }) : 
      false;

    // Handle click event - explicitly handle disabled state with proper type safety
    const handleClick = (): void => {
      if (!isDisabled) {
        handleSelectDay(day);
      }
    };

    // Compute class names
    const classNames = [
      'w-10 h-10 flex items-center justify-center rounded-full transition-all duration-150',
      isSelectedDay ? 'bg-purple-600 text-white' : '',
      isTodayDate && !isSelectedDay ? 'border border-purple-600 text-purple-700' : '',
      !isInCurrentMonth ? 'text-gray-300' : (isDisabled ? 'text-gray-300' : 'text-gray-800'),
      isInRange && !isSelectedDay ? 'bg-purple-100' : '',
      isDisabled ? 'cursor-not-allowed' : 'hover:bg-gray-100'
    ].filter(Boolean).join(' ');
    
    // Return different button based on disabled state
    if (isDisabled) {
      return (
        <button
          key={day.toString()}
          type="button"
          disabled={true}
          className={classNames}
        >
          {day.getDate()}
        </button>
      );
    }
    
    return (
      <button
        key={day.toString()}
        type="button"
        disabled={false}
        className={classNames}
        onClick={handleClick}
      >
        {day.getDate()}
      </button>
    );
  };

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const day = i === 0 ? 6 : i - 1; // Adjust to locale's starting day
    // Usando uma data fixa apenas para obter os nomes dos dias da semana
    const weekdayDate = new Date(2021, 1, day + 1);
    return new Intl.DateTimeFormat(localeString, { weekday: 'short' }).format(weekdayDate).slice(0, 2);
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-overlay flex flex-col items-center justify-end animate-fade-in">
      <div className="bg-white w-full rounded-t-xl max-w-md animate-slide-up">
        <div className="border-b border-gray-100">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-150"
              onClick={goToPreviousMonth}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-gray-800 font-medium">
              {formatForDisplay(currentMonth).split(' ').slice(1).join(' ')}
            </span>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-150"
              onClick={goToNextMonth}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Week days header */}
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map((day, index) => (
              <div key={index} className="text-center text-xs text-gray-500 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => renderDay(day))}
          </div>

          {/* Today button */}
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 rounded-lg text-gray-800 hover:bg-gray-200 transition-colors duration-150"
              onClick={selectToday}
            >
              {t('today')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatePickerSheet;
