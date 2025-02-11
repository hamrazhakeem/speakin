import React from 'react';
import { X } from 'lucide-react';
import LoadingSpinner from '../../../common/ui/LoadingSpinner';

const ReportModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  reportText, 
  setReportText, 
  isSubmitting 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Report Session Issue</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="report" className="block text-sm font-medium text-gray-700 mb-2">
              Please describe the issue you experienced
            </label>
            <textarea
              id="report"
              rows={4}
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Provide details about your concern..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 
                placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          
          <div className="flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg 
                transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reportText.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="text-white" />
                  Submitting...
                </>
              ) : (
                'Submit Report'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal; 