import React from 'react';
import { ChevronRight } from 'lucide-react';

const ConfirmationModal = ({ 
  show, 
  title, 
  description, 
  additionalInfo,
  onCancel, 
  onConfirm, 
  confirmText = "Proceed",
  cancelText = "Cancel" 
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <div className="mt-4 space-y-3 text-gray-600">
            <p>{description}</p>
            {additionalInfo && (
              <p className="font-medium text-blue-600">{additionalInfo}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            {confirmText}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;