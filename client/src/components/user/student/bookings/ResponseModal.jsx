import React from 'react';
import { X } from 'lucide-react';

const ResponseModal = ({ isOpen, onClose, report }) => {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Issue Report Review</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-lg font-medium text-gray-900">Reported Issue</h4>
            <p className="text-gray-700 mt-1">{report.description || "No details provided."}</p>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900">Admin Response</h4>
            <p className={`mt-1 ${report.status === 'responded' ? 'text-gray-700' : 'text-gray-500 italic'}`}>
              {report.status === 'responded' ? report.admin_response : "The issue is still under review. Please check back later."}
            </p>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponseModal;
