import React, { useMemo } from 'react';
import { X, Trophy, Target, History, CheckCircle2, XCircle, TrendingUp, Calendar } from 'lucide-react';
import { IEvent, EventStatus } from '../types';
import { formatDisplayDate } from '../utils/dateUtils';

interface TaskStatsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string | null;
  allEvents: IEvent[];
}

const TaskStatsDrawer: React.FC<TaskStatsDrawerProps> = ({ isOpen, onClose, taskTitle, allEvents }) => {
  const stats = useMemo(() => {
    if (!taskTitle) return null;

    // Filter all events with the same title, sort by date descending
    const relatedEvents = allEvents
      .filter(e => e.title === taskTitle)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const total = relatedEvents.length;
    const completed = relatedEvents.filter(e => e.status === EventStatus.DONE).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Calculate Streak (consecutive completed days looking backwards from most recent)
    let streak = 0;
    // We only count streaks for events that are actually Done. 
    // This is a simplified streak calculation based on the sorted list.
    for (const event of relatedEvents) {
      if (event.status === EventStatus.DONE) {
        streak++;
      } else {
        // If we hit a TODO that is in the past, streak breaks. 
        // If it's in the future, we ignore it.
        if (new Date(event.date) < new Date()) {
           break;
        }
      }
    }

    return {
      relatedEvents,
      total,
      completed,
      rate,
      streak
    };
  }, [taskTitle, allEvents]);

  if (!isOpen || !taskTitle || !stats) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto transition-opacity" 
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col pointer-events-auto animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-boss-50">
          <div>
            <h2 className="text-xl font-bold text-boss-900 break-words pr-4">{taskTitle}</h2>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <History size={14} />
              Performance History
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white text-gray-400 hover:text-gray-600 rounded-full shadow-sm hover:shadow transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex flex-col items-center justify-center text-center">
             <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                <Target size={20} />
             </div>
             <span className="text-2xl font-bold text-emerald-700">{stats.rate}%</span>
             <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Completion Rate</span>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex flex-col items-center justify-center text-center">
             <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2">
                <Trophy size={20} />
             </div>
             <span className="text-2xl font-bold text-amber-700">{stats.streak}</span>
             <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">Current Streak</span>
          </div>

          <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl col-span-2 flex items-center justify-between px-8">
             <div className="text-center">
               <span className="block text-xl font-bold text-gray-800">{stats.total}</span>
               <span className="text-xs text-gray-500">Total Assigned</span>
             </div>
             <div className="h-8 w-px bg-gray-200"></div>
             <div className="text-center">
               <span className="block text-xl font-bold text-boss-600">{stats.completed}</span>
               <span className="text-xs text-gray-500">Completed</span>
             </div>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={16} />
            Recent Activity
          </h3>
          
          <div className="space-y-3">
            {stats.relatedEvents.length === 0 ? (
               <p className="text-gray-400 text-sm">No history found.</p>
            ) : (
              stats.relatedEvents.map((event) => (
                <div 
                  key={event.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    event.status === EventStatus.DONE 
                      ? 'bg-white border-emerald-100 shadow-sm' 
                      : 'bg-gray-50 border-gray-100 opacity-70'
                  }`}
                >
                   <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          event.status === EventStatus.DONE ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-400'
                      }`}>
                          {event.status === EventStatus.DONE ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-medium text-gray-700">
                             {formatDisplayDate(event.date)}
                           </span>
                           {event.scope && (
                             <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 rounded">
                               {event.scope}
                             </span>
                           )}
                        </div>
                        <span className="text-xs text-gray-400">
                            {event.status === EventStatus.DONE ? 'Completed' : 'Missed / Pending'}
                        </span>
                      </div>
                   </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TaskStatsDrawer;