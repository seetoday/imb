import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateISO, getDaysInMonth, getFirstDayOfMonth } from '../utils/dateUtils';

interface MiniCalendarProps {
  currentDate: string; // ISO String YYYY-MM-DD
  onSelectDate: (date: string) => void;
  className?: string;
}

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const MiniCalendar: React.FC<MiniCalendarProps> = ({ currentDate, onSelectDate, className = '' }) => {
  // Parse input date or default to today
  const initialDate = currentDate ? new Date(currentDate + 'T00:00:00') : new Date();
  
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  // Update view when external currentDate changes significantly (e.g. jumped years)
  useEffect(() => {
    const d = new Date(currentDate + 'T00:00:00');
    // Only update view if it's very different, otherwise user navigation might get reset annoying
    if (Math.abs(d.getMonth() - viewMonth) > 1 || d.getFullYear() !== viewYear) {
       setViewYear(d.getFullYear());
       setViewMonth(d.getMonth());
    }
  }, [currentDate]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    onSelectDate(formatDateISO(date));
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const startDayOffset = getFirstDayOfMonth(viewYear, viewMonth); // 0 = Mon
  
  // Grid generation
  const blanks = Array(startDayOffset).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Check if a day is "Today"
  const today = new Date();
  const isToday = (d: number) => 
    today.getDate() === d && 
    today.getMonth() === viewMonth && 
    today.getFullYear() === viewYear;

  // Check if a day is "Selected"
  const isSelected = (d: number) => {
    if (!currentDate) return false;
    const [selYear, selMonth, selDay] = currentDate.split('-').map(Number);
    return selDay === d && (selMonth - 1) === viewMonth && selYear === viewYear;
  }

  return (
    <div 
      className={`bg-white rounded-xl border border-gray-100 p-3 select-none ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-sm font-semibold text-boss-900">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <div className="flex gap-1">
          <button 
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-800 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((day, i) => (
          <div key={i} className="text-center text-[10px] font-medium text-gray-400 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-1 gap-x-0.5">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days.map(day => {
          const selected = isSelected(day);
          const todayDay = isToday(day);
          
          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`
                h-7 w-full rounded-md text-xs flex items-center justify-center transition-all relative
                ${selected 
                  ? 'bg-boss-900 text-white font-medium shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-boss-900'
                }
                ${todayDay && !selected ? 'text-boss-600 font-bold bg-boss-50' : ''}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;