import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Trash2, Edit2, Calendar as CalendarIcon } from 'lucide-react';
import { IEvent, EventStatus, EventType, EventScope } from '../types';
import { formatDateISO, formatDisplayDate, getRelativeDateLabel, addDays } from '../utils/dateUtils';

interface DailyViewProps {
  currentDate: string;
  onDateChange: (date: string) => void;
  events: IEvent[];
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (event: IEvent) => void;
}

const DailyView: React.FC<DailyViewProps> = ({ 
  currentDate, 
  onDateChange, 
  events, 
  onToggleStatus, 
  onDelete,
  onEdit 
}) => {
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  const handlePrevDay = () => onDateChange(addDays(currentDate, -1));
  const handleNextDay = () => onDateChange(addDays(currentDate, 1));
  const handleToday = () => onDateChange(formatDateISO(new Date()));

  // Sort events: TODO first, then by priority, then time
  const sortedEvents = [...events].sort((a, b) => {
    if (a.status !== b.status) return a.status === EventStatus.DONE ? 1 : -1;
    // Priority sort could go here
    return 0;
  });

  const relativeLabel = getRelativeDateLabel(currentDate);

  const getTypeColor = (type: EventType) => {
    switch (type) {
      case EventType.LEARNING: return 'text-purple-600 bg-purple-50 border-purple-100';
      case EventType.ROUTINE: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case EventType.REMINDER: return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Date Header */}
      <div className="flex items-center justify-between mb-8 relative">
        <div>
          <h1 className="text-3xl font-bold text-boss-900 tracking-tight flex items-baseline gap-3">
             {relativeLabel || formatDisplayDate(currentDate)}
             {relativeLabel && <span className="text-sm font-normal text-gray-400">{formatDisplayDate(currentDate)}</span>}
          </h1>
          <p className="text-gray-500 mt-1">Manage your daily mission.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm relative z-20">
          <button onClick={handlePrevDay} className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors" title="Previous Day">
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={handleToday}
            className="px-3 py-1.5 text-sm font-medium text-boss-700 hover:bg-gray-50 rounded-md transition-colors"
          >
            Today
          </button>
          <button onClick={handleNextDay} className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors" title="Next Day">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 space-y-3 pb-20">
        {sortedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
            <CalendarIcon size={48} className="mb-4 text-gray-300" />
            <p className="font-medium">No events for this day</p>
            <p className="text-sm mt-1">Be a Boss, plan something.</p>
          </div>
        ) : (
          sortedEvents.map((event) => (
            <div 
              key={event.id}
              onMouseEnter={() => setHoveredEventId(event.id)}
              onMouseLeave={() => setHoveredEventId(null)}
              className={`group relative bg-white border rounded-xl p-4 transition-all duration-200 ease-in-out ${
                event.status === EventStatus.DONE 
                  ? 'border-gray-100 bg-gray-50/50' 
                  : 'border-gray-200 shadow-sm hover:shadow-md hover:border-boss-200'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button 
                  onClick={() => onToggleStatus(event.id)}
                  className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    event.status === EventStatus.DONE 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'border-gray-300 hover:border-boss-500 text-transparent'
                  }`}
                >
                  <Check size={14} strokeWidth={3} />
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                     <h3 className={`text-lg font-semibold truncate pr-8 transition-colors ${
                       event.status === EventStatus.DONE ? 'text-gray-400 line-through' : 'text-gray-900'
                     }`}>
                      {event.title}
                     </h3>
                     {event.time && (
                       <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                         {event.time}
                       </span>
                     )}
                  </div>
                  
                  <div className="flex items-center gap-3 mt-2">
                     {/* Scope Badge (New) */}
                     {event.scope && event.scope !== EventScope.DAY && (
                         <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-boss-900 text-white">
                             {event.scope}
                         </span>
                     )}
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${getTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                    {event.priority === 'HIGH' && event.status !== 'DONE' && (
                       <span className="text-xs font-medium text-rose-600 flex items-center gap-1">
                         • High Priority
                       </span>
                    )}
                  </div>

                  {event.description && event.status !== EventStatus.DONE && (
                    <div className="mt-3 pl-3 border-l-2 border-gray-100">
                      <p className="text-sm text-gray-500 line-clamp-2">{event.description.substring(0, 100).replace(/[*#]/g, '')}...</p>
                    </div>
                  )}
                </div>

                {/* Actions (Hover) */}
                <div className={`flex flex-col gap-1 transition-opacity ${hoveredEventId === event.id ? 'opacity-100' : 'opacity-0 md:opacity-0'}`}>
                  <button 
                    onClick={() => onEdit(event)}
                    className="p-2 text-gray-400 hover:text-boss-600 hover:bg-gray-100 rounded-lg"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(event.id)}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DailyView;