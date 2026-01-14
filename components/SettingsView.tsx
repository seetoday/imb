import React from 'react';
import { Settings, LayoutDashboard, Calendar, PieChart, Briefcase, CheckCircle2 } from 'lucide-react';
import { UserSettings, EventScope } from '../types';

interface SettingsViewProps {
  settings: UserSettings;
  onSaveSettings: (settings: UserSettings) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onSaveSettings }) => {
  
  const toggleScope = (scope: EventScope) => {
    const current = settings.enabledScopes;
    let updated: EventScope[];

    if (current.includes(scope)) {
      // Prevent disabling the last remaining scope to avoid empty app state
      if (current.length <= 1) return; 
      updated = current.filter(s => s !== scope);
    } else {
      updated = [...current, scope];
    }

    onSaveSettings({ ...settings, enabledScopes: updated });
  };

  const options = [
    { id: EventScope.DAY, label: 'Daily Planning', description: 'Manage tasks day by day.', icon: LayoutDashboard },
    { id: EventScope.WEEK, label: 'Weekly Planning', description: 'Set objectives for the week.', icon: Calendar },
    { id: EventScope.MONTH, label: 'Monthly Planning', description: 'High-level goals for the month.', icon: PieChart },
    { id: EventScope.YEAR, label: 'Yearly Planning', description: 'Strategic long-term vision.', icon: Briefcase },
  ];

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-boss-900 tracking-tight flex items-center gap-3">
          <Settings className="text-boss-600" size={28} />
          Settings
        </h1>
        <p className="text-gray-500 mt-2">Customize your Boss experience.</p>
      </div>

      {/* Dimensions Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-bold text-boss-800">Planning Dimensions</h2>
          <p className="text-sm text-gray-500 mt-1">
            Choose which time dimensions you want to manage. Unused dimensions will be hidden from the sidebar and task creation menus.
          </p>
        </div>

        <div className="p-2">
          {options.map((opt) => {
            const isEnabled = settings.enabledScopes.includes(opt.id);
            return (
              <div 
                key={opt.id}
                onClick={() => toggleScope(opt.id)}
                className={`flex items-center gap-4 p-4 m-2 rounded-xl transition-all cursor-pointer border ${
                  isEnabled 
                    ? 'bg-white border-boss-200 shadow-sm' 
                    : 'bg-gray-50 border-transparent opacity-60 hover:opacity-80'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isEnabled ? 'bg-boss-900 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                   <opt.icon size={20} />
                </div>

                <div className="flex-1">
                  <h3 className={`font-semibold ${isEnabled ? 'text-boss-900' : 'text-gray-500'}`}>
                    {opt.label}
                  </h3>
                  <p className="text-sm text-gray-400">{opt.description}</p>
                </div>

                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isEnabled 
                    ? 'border-emerald-500 bg-emerald-500 text-white' 
                    : 'border-gray-300 bg-transparent'
                }`}>
                  {isEnabled && <CheckCircle2 size={14} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;