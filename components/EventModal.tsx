import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Bookmark, CheckCircle2, Target, CalendarDays, CalendarRange, Lightbulb } from 'lucide-react';
import { IEvent, EventType, EventPriority, EventStatus, EventScope, UserSettings } from '../types';
import MarkdownEditor from './MarkdownEditor';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: IEvent) => void;
  initialDate: string;
  eventToEdit?: IEvent;
  settings: UserSettings;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, initialDate, eventToEdit, settings }) => {
  const [title, setTitle] = useState('');
  const [scope, setScope] = useState<EventScope>(EventScope.DAY);
  const [type, setType] = useState<EventType>(EventType.REMINDER);
  const [priority, setPriority] = useState<EventPriority>(EventPriority.MEDIUM);
  
  // Date states
  const [date, setDate] = useState(initialDate); // Stores YYYY-MM-DD
  const [monthInput, setMonthInput] = useState(''); // Stores YYYY-MM
  const [yearInput, setYearInput] = useState(new Date().getFullYear().toString());
  
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (eventToEdit) {
        setTitle(eventToEdit.title);
        // If we are "promoting" an idea (editing an idea), we likely want to switch scope to DAY by default for convenience,
        // but let's stick to the current state unless we want to force a UX pattern.
        // Users can manually click "Daily".
        setScope(eventToEdit.scope || EventScope.DAY);
        
        setType(eventToEdit.type);
        setPriority(eventToEdit.priority);
        setDate(eventToEdit.date || initialDate);
        setTime(eventToEdit.time || '');
        setDescription(eventToEdit.description || '');
        
        // Initialize scope specific inputs
        setMonthInput(eventToEdit.date ? eventToEdit.date.substring(0, 7) : initialDate.substring(0, 7));
        setYearInput(eventToEdit.date ? eventToEdit.date.substring(0, 4) : initialDate.substring(0, 4));
      } else {
        // Reset for new event
        setTitle('');
        
        // Find the first available scope from settings to default to
        const defaultScope = settings.enabledScopes.includes(EventScope.DAY) ? EventScope.DAY : (settings.enabledScopes[0] || EventScope.IDEA);
        setScope(defaultScope);

        setType(EventType.REMINDER);
        setPriority(EventPriority.MEDIUM);
        setDate(initialDate);
        setMonthInput(initialDate.substring(0, 7));
        setYearInput(initialDate.substring(0, 4));
        setTime('');
        setDescription('');
      }
    }
  }, [isOpen, initialDate, eventToEdit, settings]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Determine final stored date based on scope
    let finalDate = date;
    if (scope === EventScope.WEEK) {
        // MVP simplified week handling
        finalDate = date; 
    } else if (scope === EventScope.MONTH) {
        finalDate = `${monthInput}-01`;
    } else if (scope === EventScope.YEAR) {
        finalDate = `${yearInput}-01-01`;
    } else if (scope === EventScope.IDEA) {
        finalDate = ''; // Ideas don't necessarily need a target date, but we can keep creation date if we want
    }

    const newEvent: IEvent = {
      id: eventToEdit?.id || crypto.randomUUID(),
      title,
      type,
      scope,
      priority,
      status: eventToEdit?.status || EventStatus.TODO,
      date: finalDate,
      time: scope === EventScope.DAY ? (time || undefined) : undefined,
      description,
      createdAt: eventToEdit?.createdAt || Date.now(),
    };

    onSave(newEvent);
    onClose();
  };

  const renderScopeSelector = () => {
    // Defines all options
    const allOptions = [
      { id: EventScope.DAY, icon: Calendar, label: 'Daily' },
      { id: EventScope.WEEK, icon: CalendarRange, label: 'Weekly' },
      { id: EventScope.MONTH, icon: CalendarDays, label: 'Monthly' },
      { id: EventScope.YEAR, icon: Target, label: 'Yearly' },
      { id: EventScope.IDEA, icon: Lightbulb, label: 'Idea' },
    ];

    // Filter based on settings (Always show IDEA as it is a special type)
    const visibleOptions = allOptions.filter(opt => 
        opt.id === EventScope.IDEA || settings.enabledScopes.includes(opt.id)
    );

    return (
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto no-scrollbar">
          {visibleOptions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setScope(item.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                scope === item.id 
                  ? 'bg-white text-boss-900 shadow-sm ring-1 ring-gray-200' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              <item.icon size={16} className={item.id === EventScope.IDEA ? 'text-amber-500' : ''} />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-boss-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-semibold text-boss-800 flex items-center gap-2">
            {eventToEdit ? 'Edit Mission' : 'New Mission'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Scope Selector */}
          {renderScopeSelector()}

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {scope === EventScope.DAY ? 'What needs to be done?' : 
               scope === EventScope.IDEA ? 'What is the idea?' :
               `What is your ${scope.toLowerCase()} goal?`}
            </label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={scope === EventScope.IDEA ? "e.g., Learn to fly a helicopter" : "e.g., Study Spring Boot"}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-boss-500 focus:ring-2 focus:ring-boss-200 outline-none transition-all text-lg placeholder-gray-400"
            />
          </div>

          {/* Type & Priority Row - Show for all except Idea (optional, but let's keep it simple) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <div className="flex gap-2">
                {[EventType.ROUTINE, EventType.REMINDER, EventType.LEARNING].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                      type === t 
                        ? 'bg-boss-800 text-white border-boss-800' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <div className="flex gap-2">
                {[EventPriority.LOW, EventPriority.MEDIUM, EventPriority.HIGH].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                      priority === p 
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Date/Time Inputs based on Scope */}
          {scope !== EventScope.IDEA && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
               {scope === EventScope.DAY && (
                   <>
                   <div>
                       <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date</label>
                       <input
                           type="date"
                           value={date}
                           onChange={(e) => setDate(e.target.value)}
                           className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-boss-500 outline-none"
                       />
                   </div>
                   <div>
                       <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Time (Optional)</label>
                       <input
                           type="time"
                           value={time}
                           onChange={(e) => setTime(e.target.value)}
                           className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-boss-500 outline-none"
                       />
                   </div>
                   </>
               )}

               {scope === EventScope.WEEK && (
                   <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Select Week Start</label>
                        <div className="flex items-center gap-2">
                           <CalendarRange className="text-gray-400" size={16} />
                           <input
                               type="date" 
                               value={date}
                               onChange={(e) => setDate(e.target.value)}
                               className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-boss-500 outline-none"
                           />
                           <span className="text-xs text-gray-400 italic">Select any day in the target week</span>
                        </div>
                   </div>
               )}

               {scope === EventScope.MONTH && (
                   <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Select Month</label>
                        <input
                           type="month"
                           value={monthInput}
                           onChange={(e) => setMonthInput(e.target.value)}
                           className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-boss-500 outline-none"
                        />
                   </div>
               )}

                {scope === EventScope.YEAR && (
                   <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Select Year</label>
                        <input
                           type="number"
                           min="2020"
                           max="2030"
                           value={yearInput}
                           onChange={(e) => setYearInput(e.target.value)}
                           className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-boss-500 outline-none"
                        />
                   </div>
               )}
             </div>
          )}

          {/* Description / Notes */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Execution Plan & Notes</label>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Bookmark size={12} /> Markdown
              </span>
            </div>
            <MarkdownEditor 
              value={description} 
              onChange={setDescription} 
              placeholder="# Plan\n- Key result 1...\n- Key result 2..."
              className="min-h-[200px]"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-boss-900 hover:bg-boss-800 shadow-md shadow-boss-900/20 transition-all flex items-center gap-2"
          >
            <CheckCircle2 size={16} />
            {eventToEdit ? 'Save Changes' : 'Create Mission'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;