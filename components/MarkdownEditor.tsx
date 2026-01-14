import React, { useState } from 'react';
import { Eye, Edit3, Bold, Italic, List, Hash } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange, placeholder, className = '' }) => {
  const [isPreview, setIsPreview] = useState(false);

  const insertSyntax = (syntax: string) => {
    // Simple append for MVP. In a real editor, we'd insert at cursor.
    onChange(value + syntax);
  };

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden bg-white flex flex-col ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-1">
          <button 
            type="button"
            onClick={() => insertSyntax('**bold** ')}
            className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors" 
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button 
            type="button"
             onClick={() => insertSyntax('*italic* ')}
            className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors" 
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <div className="w-px h-4 bg-gray-300 mx-1"></div>
          <button 
            type="button"
             onClick={() => insertSyntax('# Heading ')}
            className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors" 
            title="Heading"
          >
            <Hash size={16} />
          </button>
          <button 
            type="button"
             onClick={() => insertSyntax('- List item')}
            className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors" 
            title="List"
          >
            <List size={16} />
          </button>
        </div>
        
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className="flex items-center gap-1.5 text-xs font-medium text-boss-600 hover:text-boss-800 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
        >
          {isPreview ? (
            <>
              <Edit3 size={14} /> Edit
            </>
          ) : (
            <>
              <Eye size={14} /> Preview
            </>
          )}
        </button>
      </div>

      {/* Editor / Preview Area */}
      <div className="relative flex-1 min-h-[200px]">
        {isPreview ? (
          <div className="p-4 prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
            {value || <span className="text-gray-400 italic">Nothing to preview</span>}
          </div>
        ) : (
          <textarea
            className="w-full h-full p-4 resize-none focus:outline-none text-sm text-gray-800 font-mono"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Start typing your notes here (Markdown supported)..."}
          />
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;