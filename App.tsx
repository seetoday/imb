import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DailyView from './components/DailyView';
import IdeaView from './components/IdeaView';
import AllTasksView from './components/AllTasksView';
import SettingsView from './components/SettingsView';
import EventModal from './components/EventModal';
import { ViewMode, IEvent, EventScope, EventType, EventStatus, EventPriority, UserSettings } from './types';
import { getEvents, saveEvent, deleteEvent, toggleEventStatus, getSettings, saveSettings } from './services/storageService';
import { formatDateISO } from './utils/dateUtils';
import { Plus, Menu } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.DAY);
  const [currentDate, setCurrentDate] = useState<string>(formatDateISO(new Date()));
  const [events, setEvents] = useState<IEvent[]>([]);
  const [settings, setSettings] = useState<UserSettings>(getSettings());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<IEvent | undefined>(undefined);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load data
  const refreshEvents = () => {
    setEvents(getEvents());
  };

  useEffect(() => {
    refreshEvents();
    // Also load settings if they were updated elsewhere (though React state handles local updates)
    setSettings(getSettings());
  }, []);

  const handleCreateEvent = () => {
    setEditingEvent(undefined);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: IEvent) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (event: IEvent) => {
    saveEvent(event);
    refreshEvents();
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      deleteEvent(id);
      refreshEvents();
    }
  };

  const handleToggleStatus = (id: string) => {
    toggleEventStatus(id);
    refreshEvents();
  };

  const handleSaveSettings = (newSettings: UserSettings) => {
    saveSettings(newSettings);
    setSettings(newSettings);
    // If the current view was disabled, switch to a safe default
    // e.g., if user was on Year view and disabled it
    // For now, simpler to just keep them on Settings view or switch to Day
  };

  // Idea specific handlers
  const handleAddIdea = (title: string) => {
    const newIdea: IEvent = {
        id: crypto.randomUUID(),
        title: title,
        type: EventType.REMINDER, // Default
        scope: EventScope.IDEA,
        priority: EventPriority.MEDIUM,
        status: EventStatus.TODO,
        date: '',
        createdAt: Date.now()
    };
    saveEvent(newIdea);
    refreshEvents();
  };

  const handlePromoteIdea = (idea: IEvent) => {
    // Open modal with the idea data, user can then change scope to Day/Week etc.
    const promotedDraft = { 
        ...idea, 
        scope: EventScope.DAY, 
        date: currentDate // Default to today
    };
    setEditingEvent(promotedDraft);
    setIsModalOpen(true);
  };

  // Filter events for current view
  const visibleEvents = events.filter(e => {
    if (currentView === ViewMode.DAY) {
      // Show events specifically for this day OR daily routines (excluding IDEAS)
      return e.date === currentDate && e.scope !== EventScope.IDEA;
    }
    if (currentView === ViewMode.IDEAS) {
      return e.scope === EventScope.IDEA;
    }
    if (currentView === ViewMode.ALL_TASKS) {
      // Show everything that is NOT an idea (assuming idea inbox is separate)
      return e.scope !== EventScope.IDEA;
    }
    // Placeholder logic for other views
    return false;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-boss-900">
      
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setMobileMenuOpen(false)} 
        />
      )}
      
      {/* Mobile Sidebar Container (Drawer) */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <Sidebar 
            currentView={currentView} 
            currentDate={currentDate}
            onChangeView={(view) => { setCurrentView(view); setMobileMenuOpen(false); }}
            onDateChange={(date) => { setCurrentDate(date); }}
            onAddEvent={() => { handleCreateEvent(); setMobileMenuOpen(false); }}
            settings={settings}
          />
      </div>

      {/* Desktop Sidebar Container */}
      <div className="hidden md:block fixed left-0 top-0 z-10 h-full w-64">
        <Sidebar 
          currentView={currentView} 
          currentDate={currentDate}
          onChangeView={setCurrentView}
          onDateChange={setCurrentDate}
          onAddEvent={handleCreateEvent}
          settings={settings}
        />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-boss-900 rounded-lg flex items-center justify-center">
             <span className="text-white font-bold text-lg">i</span>
           </div>
           <span className="font-bold text-lg">imb</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <Menu size={24} />
        </button>
      </div>

      {/* Main Content Area */}
      <main className="md:ml-64 min-h-screen p-4 md:p-12 max-w-7xl mx-auto">
        {currentView === ViewMode.DAY && (
          <DailyView 
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            events={visibleEvents}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteEvent}
            onEdit={handleEditEvent}
          />
        )}

        {currentView === ViewMode.IDEAS && (
          <IdeaView 
            ideas={visibleEvents}
            onAddIdea={handleAddIdea}
            onPromote={handlePromoteIdea}
            onDelete={handleDeleteEvent}
          />
        )}

        {currentView === ViewMode.ALL_TASKS && (
          <AllTasksView
            events={visibleEvents}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteEvent}
            onEdit={handleEditEvent}
          />
        )}

        {currentView === ViewMode.SETTINGS && (
          <SettingsView
             settings={settings}
             onSaveSettings={handleSaveSettings}
          />
        )}

        {currentView !== ViewMode.DAY && currentView !== ViewMode.IDEAS && currentView !== ViewMode.ALL_TASKS && currentView !== ViewMode.SETTINGS && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                <Menu size={32} />
             </div>
            <div>
              <h2 className="text-2xl font-bold text-boss-900">Coming Soon</h2>
              <p className="text-gray-500 mt-2">The {currentView.toLowerCase()} view is under construction.</p>
              <p className="text-sm text-gray-400">Check the New Task modal to create {currentView.toLowerCase()} goals.</p>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Floating Action Button */}
      <button 
        onClick={handleCreateEvent}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-boss-900 text-white rounded-full shadow-xl shadow-boss-900/30 flex items-center justify-center z-20 active:scale-95 transition-transform"
      >
        <Plus size={24} />
      </button>

      {/* Modals */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        initialDate={currentDate}
        eventToEdit={editingEvent}
        settings={settings}
      />
    </div>
  );
};

export default App;