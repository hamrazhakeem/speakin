import React, { useState } from 'react';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import AdminButton from '../ui/AdminButton';
import Avatar from '../../common/ui/Avatar';
import Dialog from './Dialog';
import LoadingSpinner from '../../common/ui/LoadingSpinner';

const ReportsTable = ({ reports, activeTab, onResolve }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null); // 'description', 'response', or 'resolve'
  const [adminResponse, setAdminResponse] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  if (reports.length === 0) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No Reports Found</h3>
        <p className="text-zinc-400">
          {activeTab === 'pending'
            ? 'There are no pending reports to review'
            : activeTab === 'responded'
            ? 'No responded reports available'
            : 'No reports have been submitted yet'}
        </p>
      </div>
    );
  }

  const handleViewDetails = (report, type) => {
    setSelectedReport(report);
    setDialogType(type);
    setIsDialogOpen(true);
  };

  const handleResolveClick = (report) => {
    setSelectedReport(report);
    setDialogType('resolve');
    setAdminResponse('');
    setIsDialogOpen(true);
  };

  const handleSubmitResponse = () => {
    if (adminResponse.trim()) {
      setLoading(true);
      onResolve(
        selectedReport.id, 
        adminResponse.trim(),
        selectedReport.booking,
        selectedReport.reporter_id,
      );
      setLoading(false);
      setIsDialogOpen(false);
      setAdminResponse('');
    }
  };

  const renderDialogContent = () => {
    switch (dialogType) {
      case 'description':
        return <p className="text-white">{selectedReport?.description}</p>;
      case 'response':
        return <p className="text-white">{selectedReport?.admin_response || 'No response yet'}</p>;
      case 'resolve':
        return (
          <div className="space-y-4">
            <textarea
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              placeholder="Enter your response to this report..."
              className="w-full h-32 px-4 py-2 text-white bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 resize-none"
            />
          <div className="flex justify-end">
            <AdminButton
              variant="secondary"
              size="sm"
              onClick={handleSubmitResponse}
              disabled={loading || !adminResponse.trim()}
            >
              {loading ? (
                <LoadingSpinner size='sm' />
              ) : (
                "Submit Response"
              )}
            </AdminButton>
          </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="relative">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-zinc-800">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 w-[250px]">Reporter</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 w-[250px]">Reported User</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 w-[120px]">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 w-[160px]">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 w-[160px]">Response</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 w-[160px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-zinc-900/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={report.reporter_details?.profile_image}
                          name={report.reporter_details?.name}
                          size={40}
                        />
                        <div>
                          <div className="text-sm font-medium text-white">
                            {report.reporter_details?.name}
                          </div>
                          <div className="text-sm text-zinc-400">
                            {report.reporter_details?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={report.tutor_details?.profile_image}
                          name={report.tutor_details?.name}
                          size={40}
                        />
                        <div>
                          <div className="text-sm font-medium text-white">
                            {report.tutor_details?.name}
                          </div>
                          <div className="text-sm text-zinc-400">
                            {report.tutor_details?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${report.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-green-500/10 text-green-500'}`}>
                        {report.status === 'pending' ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <AdminButton
                        variant="secondary"
                        size="sm"
                        onClick={() => handleViewDetails(report, 'description')}
                      >
                        View
                      </AdminButton>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <AdminButton
                        variant="secondary"
                        size="sm"
                        onClick={() => handleViewDetails(report, 'response')}
                      >
                        View
                      </AdminButton>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.status === 'pending' && (
                        <AdminButton
                          variant="secondary"
                          size="sm"
                          onClick={() => handleResolveClick(report)}
                        >
                          Resolve
                        </AdminButton>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={dialogType === 'description' ? 'Report Description' : 
              dialogType === 'response' ? 'Admin Response' : 
              'Resolve Report'}
      >
        {selectedReport && renderDialogContent()}
      </Dialog>
    </>
  );
};

export default ReportsTable; 