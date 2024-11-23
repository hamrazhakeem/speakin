import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import useAxios from '../hooks/useAxios';
import { toast } from 'react-toastify';

const AdminVerifyLanguageChangePage = () => {
  const location = useLocation();
  const { state: requestData } = location;
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [approveLoading, setApproveLoading] = useState(false);
  const [denyLoading, setDenyLoading] = useState(false);

  const handleAction = async (action) => {
    const loadingState = action === 'approve' ? setApproveLoading : setDenyLoading;
    loadingState(true);
    
    try {
      if (action === 'approve') {
        await axiosInstance.patch(`teaching-language-change-requests/${requestData.id}/`);
        toast.success('Language Change Request Approved Successfully');
      } else {
        await axiosInstance.delete(`teaching-language-change-requests/${requestData.id}/`);
        toast.success('Language Change Request Denied Successfully');
      }
      navigate('/admin/manage-users/');
    } catch (error) {
      console.error(`Error ${action}ing language change request:`, error);
      toast.error(`Failed to ${action} Language Change Request`);
    } finally {
      loadingState(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <AdminNavbar />
      <main className="flex-1 flex justify-center items-center p-4 mt-16 md:mt-24 mb-10">
        <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Verify Tutor Language Change Request
          </h1>

          {requestData ? (
            <div className="space-y-8">
              <Section title="Tutor Information">
                <InfoItem label="Full Name" value={requestData.full_name} />
                <InfoItem label="Email" value={requestData.user?.email} />
                <InfoItem label="Account Status" 
                  value={
                    <span className={`px-2 py-1 rounded ${requestData.user?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {requestData.user?.is_active ? 'Active' : 'Inactive'}
                    </span>
                  } 
                />
              </Section>

              <Section title="Language Change Details">
                <InfoItem 
                  label="Current Language" 
                  value={requestData.tutor_language_to_teach?.[0]?.language || 'N/A'} 
                />
                <InfoItem 
                  label="New Language" 
                  value={requestData.new_language} 
                />
                <InfoItem 
                  label="Native Speaker" 
                  value={requestData.is_native ? 'Yes' : 'No'} 
                />
              </Section>

              <Section title="Verification Documents">
                <InfoItem 
                  label="About" 
                  value={requestData.about} 
                />
                {requestData.certificate && (
                  <InfoItem
                    label="Language Certificate"
                    value={
                      <a 
                        href={requestData.certificate} 
                        className="text-blue-500 hover:underline"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        View Certificate
                      </a>
                    }
                  />
                )}
                {requestData.intro_video && (
                  <InfoItem
                    label="Introduction Video"
                    value={
                      <a 
                        href={requestData.intro_video} 
                        className="text-blue-500 hover:underline"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        View Introduction Video
                      </a>
                    }
                  />
                )}
              </Section>

              <div className="flex justify-center space-x-4 mt-10">
                <button
                  className="px-6 py-2 bg-red-500 text-white flex items-center rounded hover:bg-red-600 transition-colors"
                  onClick={() => handleAction('deny')}
                  disabled={denyLoading}
                >
                  {denyLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  ) : (
                    <>
                      <FaTimesCircle className="mr-2" /> Deny
                    </>
                  )}
                </button>

                <button
                  className="px-6 py-2 bg-green-500 text-white flex items-center rounded hover:bg-green-600 transition-colors"
                  onClick={() => handleAction('approve')}
                  disabled={approveLoading}
                >
                  {approveLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  ) : (
                    <>
                      <FaCheckCircle className="mr-2" /> Approve
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600">No request data available.</p>
          )}
        </div>
      </main>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="border-b pb-4">
    <h2 className="text-xl font-semibold mb-4 border-b-2 border-gray-200 pb-2">{title}</h2>
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
      {children}
    </div>
  </div>
);

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between py-2 bg-white border rounded-lg p-4 shadow-sm mb-4">
    <span className="font-medium">{label}:</span>
    <span className="text-gray-700">{value}</span>
  </div>
);

export default AdminVerifyLanguageChangePage;