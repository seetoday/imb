import React, { useState } from 'react';
import { Search, Check, Trash2, Edit2, Calendar, Filter, Archive, BarChart2 } from 'lucide-react';
import { IEvent, EventStatus, EventType, EventPriority } from '../types';
import TaskStatsDrawer from './TaskStatsDrawer';

interface AllTasksViewProps {
  events: IEvent[];
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (event: IEvent) => void;
}

const AllTasksView: React.FC<AllTasksViewProps> = ({ events, onToggleStatus, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'TODO' | 'DONE'>('ALL');
  const [filterType, setFilterType] = useState<'ALL' | EventType>('ALL');
  
  // Stats Drawer State
  const [selectedTaskTitle, setSelectedTaskTitle] = useState<string | null>(null);

  // Filter and Sort Logic
  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (event.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' ? true : event.status === filterStatus;
      const matchesType = filterType === 'ALL' ? true : event.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      // Sort by Date (descending) then by Status (todo first)
      if (a.date !== b.date) return a.date > b.date ? -1 : 1;
      return a.status === EventStatus.DONE ? 1 : -1;
    });

  const getTypeColor = (type: EventType) => {
    switch (type) {
      case EventType.LEARNING: return 'text-purple-600 bg-purple-50 border-purple-100';
      case EventType.ROUTINE: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case EventType.REMINDER: return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-boss-900 tracking-tight flex items-center gap-3">
          <Archive className="text-boss-600" size={28} />
          All Tasks
        </h1>
        <p className="text-gray-500 mt-2">Search, edit, and manage your complete history.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-boss-200 focus:border-boss-400 outline-none transition-all"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
           {/* Type Filter */}
           <div className="flex bg-white p-1 rounded-xl border border-gray-200 overflow-x-auto no-scrollbar">
             {[
               { label: 'All Types', value: 'ALL' },
               { label: 'Routine', value: EventType.ROUTINE },
               { label: 'Reminder', value: EventType.REMINDER },
               { label: 'Learning', value: EventType.LEARNING }
             ].map((type) => (
               <button
                 key={type.value}
                 onClick={() => setFilterType(type.value as any)}
                 className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                   filterType === type.value 
                     ? 'bg-boss-900 text-white shadow-sm' 
                     : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                 }`}
               >
                 {type.label}
               </button>
             ))}
           </div>

           {/* Status Filter */}
           <div className="flex bg-white p-1 rounded-xl border border-gray-200 shrink-0">
             {(['ALL', 'TODO', 'DONE'] as const).map((status) => (
               <button
                 key={status}
                 onClick={() => setFilterStatus(status)}
                 className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                   filterStatus === status 
                     ? 'bg-boss-900 text-white shadow-sm' 
                     : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                 }`}
               >
                 {status === 'ALL' ? 'All Status' : status === 'TODO' ? 'Active' : 'Done'}
               </button>
             ))}
           </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pb-20 space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Filter size={48} className="mx-auto mb-4 opacity-50" />
            <p className="font-medium">No tasks found matching your criteria.</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div 
              key={event.id}
              onClick={() => setSelectedTaskTitle(event.title)}
              className={`group bg-white border rounded-xl p-4 transition-all hover:shadow-md hover:border-boss-300 cursor-pointer ${
                 event.status === EventStatus.DONE ? 'border-gray-100 bg-gray-50/50 opacity-75' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-4">
                 {/* Status Toggle */}
                 <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStatus(event.id);
                  }}
                  className={`mt-1 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    event.status === EventStatus.DONE 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'border-gray-300 hover:border-boss-500 text-transparent'
                  }`}
                >
                  <Check size={12} strokeWidth={3} />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                    <h3 className={`font-semibold truncate group-hover:text-boss-600 transition-colors ${
                       event.status === EventStatus.DONE ? 'text-gray-500 line-through' : 'text-gray-900'
                     }`}>
                      {event.title}
                    </h3>
                    
                    <div className="flex items-center gap-2">
                         {/* Date Badge */}
                        <div className="flex items-center gap-1 text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            <Calendar size={12} />
                            {event.date ? event.date : 'No Date'}
                        </div>
                        {/* Scope Badge */}
                        <span className="text-[10px] font-bold bg-boss-900 text-white px-1.5 py-0.5 rounded">
                            {event.scope}
                        </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${getTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                    {event.priority === EventPriority.HIGH && (
                       <span className="text-xs font-medium text-rose-600">High Priority</span>
                    )}
                    {/* Hint for Stats */}
                    <span className="text-xs text-boss-400 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                        <BarChart2 size={12} /> View Stats
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(event);
                    }}
                    className="p-2 text-gray-400 hover:text-boss-600 hover:bg-gray-100 rounded-lg"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(event.id);
                    }}
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

      {/* Stats Drawer */}
      <TaskStatsDrawer 
        isOpen={!!selectedTaskTitle}
        onClose={() => setSelectedTaskTitle(null)}
        taskTitle={selectedTaskTitle}
        allEvents={events}
      />
    </div>
  );
};

export default AllTasksView;