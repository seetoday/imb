import React, { useState } from 'react';
import { Lightbulb, ArrowRight, Trash2, Plus, Sparkles, Pencil } from 'lucide-react';
import { IEvent, EventType, EventPriority, EventStatus, EventScope } from '../types';
import { formatDateISO } from '../utils/dateUtils';

interface IdeaViewProps {
  ideas: IEvent[];
  onAddIdea: (title: string) => void;
  onPromote: (idea: IEvent) => void;
  onDelete: (id: string) => void;
}

const IdeaView: React.FC<IdeaViewProps> = ({ ideas, onAddIdea, onPromote, onDelete }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onAddIdea(inputValue.trim());
      setInputValue('');
    }
  };

  const handleAddClick = () => {
    if (inputValue.trim()) {
      onAddIdea(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-boss-900 tracking-tight flex items-center gap-3">
          <Sparkles className="text-amber-400 fill-amber-400" size={28} />
          Idea Inbox
        </h1>
        <p className="text-gray-500 mt-2">Capture fleeting thoughts. Plan them later.</p>
      </div>

      {/* Input Area */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 mb-8 flex items-center gap-2 focus-within:ring-2 focus-within:ring-boss-200 focus-within:border-boss-400 transition-all">
        <div className="pl-4 text-gray-400">
          <Lightbulb size={24} />
        </div>
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's on your mind? (Press Enter to save)"
          className="flex-1 py-4 px-2 text-lg outline-none text-gray-800 placeholder-gray-400 bg-transparent"
          autoFocus
        />
        <button 
          onClick={handleAddClick}
          disabled={!inputValue.trim()}
          className="p-3 bg-boss-900 text-white rounded-xl hover:bg-boss-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Ideas List */}
      <div className="flex-1 overflow-y-auto pb-20 space-y-3">
        {ideas.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <div className="inline-flex bg-gray-100 p-6 rounded-full mb-4">
               <Lightbulb size={48} className="text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-500">Your mind is clear.</p>
            <p className="text-sm text-gray-400">Add ideas above to process them later.</p>
          </div>
        ) : (
          ideas.map((idea) => (
            <div 
              key={idea.id} 
              className="group bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md hover:border-boss-300 transition-all"
            >
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-lg font-medium text-gray-800 truncate">{idea.title}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Captured on {new Date(idea.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onPromote(idea)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-boss-600 bg-boss-50 hover:bg-boss-100 rounded-lg transition-colors"
                  title="Plan this task"
                >
                  <ArrowRight size={16} />
                  Plan
                </button>
                <button 
                  onClick={() => onDelete(idea.id)}
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IdeaView;