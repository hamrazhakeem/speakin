import React from 'react';
import { X } from 'lucide-react';

const Dialog = ({ open, onClose, title, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg transform rounded-lg bg-zinc-900 border border-zinc-800 shadow-xl transition-all">
          <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
            <h3 className="text-lg font-medium text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
          
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;