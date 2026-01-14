import React from 'react';
import { LayoutDashboard, Calendar, PieChart, Briefcase, Settings, Plus, Lightbulb, ListTodo } from 'lucide-react';
import { ViewMode, UserSettings, EventScope } from '../types';
import MiniCalendar from './MiniCalendar';

interface SidebarProps {
  currentView: ViewMode;
  currentDate: string;
  onChangeView: (view: ViewMode) => void;
  onDateChange: (date: string) => void;
  onAddEvent: () => void;
  settings: UserSettings;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, currentDate, onChangeView, onDateChange, onAddEvent, settings }) => {
  
  // Define all possible planning items
  const allPlanningItems = [
    { id: ViewMode.DAY, scope: EventScope.DAY, icon: LayoutDashboard, label: 'Daily' },
    { id: ViewMode.WEEK, scope: EventScope.WEEK, icon: Calendar, label: 'Weekly' },
    { id: ViewMode.MONTH, scope: EventScope.MONTH, icon: PieChart, label: 'Monthly' },
    { id: ViewMode.YEAR, scope: EventScope.YEAR, icon: Briefcase, label: 'Yearly' },
  ];

  // Filter based on settings
  const visiblePlanningItems = allPlanningItems.filter(item => 
    settings.enabledScopes.includes(item.scope)
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 flex-shrink-0">
        <div className="w-8 h-8 bg-boss-900 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-lg">i</span>
        </div>
        <span className="text-xl font-bold text-boss-900 tracking-tight">imb</span>
        <span className="ml-auto text-xs font-medium text-gray-400 px-2 py-1 bg-gray-50 rounded">V1.0</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-4 space-y-4 overflow-y-auto no-scrollbar">
        
        {/* New Task Button */}
        <div className="px-2">
            <button 
              onClick={onAddEvent}
              className="w-full bg-boss-900 hover:bg-boss-800 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all shadow-lg shadow-boss-900/20 active:scale-95"
            >
              <Plus size={20} />
              <span>New Task</span>
            </button>
        </div>

        {/* Manage Section */}
        <div className="space-y-1">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Manage</p>
          <button
            onClick={() => onChangeView(ViewMode.IDEAS)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              currentView === ViewMode.IDEAS 
                ? 'bg-amber-50 text-amber-900 border border-amber-200/50' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Lightbulb size={18} className={currentView === ViewMode.IDEAS ? 'text-amber-500 fill-amber-500' : 'text-gray-400'} />
            Idea Inbox
          </button>
          <button
            onClick={() => onChangeView(ViewMode.ALL_TASKS)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              currentView === ViewMode.ALL_TASKS 
                ? 'bg-boss-50 text-boss-900 border border-boss-200/50' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <ListTodo size={18} className={currentView === ViewMode.ALL_TASKS ? 'text-boss-700' : 'text-gray-400'} />
            All Tasks
          </button>
        </div>

        {/* Embedded Calendar */}
        <div className="px-2 pt-2">
            <MiniCalendar 
                currentDate={currentDate} 
                onSelectDate={(d) => {
                    onDateChange(d);
                    onChangeView(ViewMode.DAY); // Switch to day view when clicking a date
                }}
            />
        </div>

        {/* Views List */}
        <div className="space-y-1">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">Planning Views</p>
          {visiblePlanningItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-boss-50 text-boss-900 border border-boss-200/50' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-boss-700' : 'text-gray-400'} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 flex-shrink-0">
        <button 
          onClick={() => onChangeView(ViewMode.SETTINGS)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
             currentView === ViewMode.SETTINGS
              ? 'bg-boss-50 text-boss-900 border border-boss-200/50' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Settings size={18} className={currentView === ViewMode.SETTINGS ? 'text-boss-700' : 'text-gray-400'} />
          Settings
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;