import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import useAxios from '../../../hooks/useAxios';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../common/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';

const LanguageVerificationContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const [approveLoading, setApproveLoading] = useState(false);
  const [denyLoading, setDenyLoading] = useState(false);
  const { state: requestData } = location;

  useEffect(() => {
    if (!requestData) {
      navigate('/admin/manage-users');
    }
  }, [requestData, navigate]);

  if (!requestData) return null;

  const handleAction = async (action) => {
    const isApprove = action === 'approve';
    const loadingSetter = isApprove ? setApproveLoading : setDenyLoading;
    
    loadingSetter(true);
    try {
      if (isApprove) {
        await axiosInstance.patch(`teaching-language-change-requests/${requestData.id}/`);
        toast.success('Language Change Request Approved Successfully');
      } else {
        await axiosInstance.delete(`teaching-language-change-requests/${requestData.id}/`);
        toast.success('Language Change Request Denied Successfully');
      }
      navigate('/admin/manage-users/');
    } catch (error) {
      console.error(`Error ${isApprove ? 'approving' : 'denying'} language change request:`, error);
      toast.error(`Failed to ${isApprove ? 'approve' : 'deny'} Language Change Request`);
    } finally {
      loadingSetter(false);
    }
  };

  const Section = ({ title, children }) => (
    <div className="bg-black border border-zinc-800 rounded-lg overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="p-6 space-y-4">
        {children}
      </div>
    </div>
  );

  const InfoItem = ({ label, value, type = "text" }) => (
    <div className="flex flex-col space-y-1">
      <span className="text-sm font-medium text-zinc-400">{label}</span>
      {type === "link" ? (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:text-blue-400 transition-colors"
        >
          View {label}
        </a>
      ) : type === "status" ? (
        <div className="flex items-start">
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === 'Active' 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {value}
          </span>
        </div>
      ) : (
        <span className="text-white">{value}</span>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate('/admin/manage-users')}
            className="flex items-center text-zinc-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </button>
          <h1 className="text-2xl font-bold text-white">Verify Language Change Request</h1>
          <p className="text-zinc-400 mt-1">Review and verify tutor's language change request</p>
        </div>
      </div>

      <div className="space-y-6">
        <Section title="Tutor Information">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem label="Full Name" value={requestData.full_name} />
              <InfoItem label="Email" value={requestData.user?.email} />
              <InfoItem 
                label="Account Status" 
                value={requestData.user?.is_active ? 'Active' : 'Inactive'}
                type="status"
              />
              <InfoItem 
                label="About" 
                value={requestData.about} 
              />
            </div>
            {requestData.profile_image && (
              <InfoItem
                label="Profile Image"
                value={requestData.profile_image}
                type="link"
              />
            )}
          </div>
        </Section>

        <Section title="Language Change Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem 
              label="Current Language" 
              value={
                <div className="flex items-center space-x-2">
                  <span className="text-white">
                    {requestData.tutor_language_to_teach?.[0]?.language || 'N/A'}
                  </span>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    requestData.tutor_language_to_teach?.[0]?.is_native 
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {requestData.tutor_language_to_teach?.[0]?.is_native ? 'Native' : 'Non-Native'}
                  </span>
                </div>
              }
            />
            <InfoItem 
              label="New Language" 
              value={
                <div className="flex items-center space-x-2">
                  <span className="text-white">
                    {requestData.new_language}
                  </span>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    requestData.is_native 
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {requestData.is_native ? 'Native Speaker' : 'Non-Native Speaker'}
                  </span>
                </div>
              }
            />
            <InfoItem 
              label="Change Type" 
              value={
                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300">
                  {requestData.is_native ? 'Native Speaker Verification' : 'Language Certificate Verification'}
                </span>
              }
            />
          </div>
        </Section>

        <Section title="Verification Documents">
          <div className="space-y-4">
            {requestData.certificate && (
              <InfoItem
                label="Language Certificate"
                value={requestData.certificate}
                type="link"
              />
            )}
            {requestData.govt_id && (
              <InfoItem
                label="Government ID"
                value={requestData.govt_id}
                type="link"
              />
            )}
            {requestData.intro_video && (
              <InfoItem
                label="Introduction Video"
                value={requestData.intro_video}
                type="link"
              />
            )}
          </div>
        </Section>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            className="px-6 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors flex items-center disabled:opacity-50"
            onClick={() => handleAction('deny')}
            disabled={denyLoading || approveLoading}
          >
            {denyLoading ? (
              <div className="flex items-center">
                <LoadingSpinner size="sm" className="text-white" />
              </div>
            ) : (
              <><FaTimesCircle className="mr-2" /> Deny</>
            )}
          </button>

          <button
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center disabled:opacity-50"
            onClick={() => handleAction('approve')}
            disabled={approveLoading || denyLoading}
          >
            {approveLoading ? (
              <div className="flex items-center">
                <LoadingSpinner size="sm" className="text-white" />
              </div>
            ) : (
              <><FaCheckCircle className="mr-2" /> Approve</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageVerificationContent;
