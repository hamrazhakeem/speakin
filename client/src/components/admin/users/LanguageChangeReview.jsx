import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxios from '../../../hooks/useAxios';
import { toast } from 'react-hot-toast';
import { VerificationContent, InfoItem } from './VerificationContent';
import { adminApi } from '../../../api/adminApi';

const LanguageChangeReview = () => {
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
        await adminApi.approveLanguageChange(axiosInstance, requestData.id);
        toast.success('Language Change Request Approved Successfully');
      } else {
        await adminApi.denyLanguageChange(axiosInstance, requestData.id);
        toast.success('Language Change Request Denied Successfully');
      }
      navigate('/admin/manage-users');
    } catch (error) {
      console.error(`Error ${isApprove ? 'approving' : 'denying'} language change request:`, error);
      toast.error(`Failed to ${isApprove ? 'approve' : 'deny'} Language Change Request`);
    } finally {
      loadingSetter(false);
    }
  };

  const sections = [
    {
      title: "Tutor Information",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem label="Full Name" value={requestData.full_name} />
            <InfoItem label="Email" value={requestData.user?.email} />
            <InfoItem 
              label="Account Status" 
              value={requestData.user?.is_active ? 'Active' : 'Inactive'}
              type="status"
            />
            <InfoItem label="About" value={requestData.about} />
          </div>
          {requestData.profile_image && (
            <InfoItem
              label="Profile Image"
              value={requestData.profile_image}
              type="link"
            />
          )}
        </div>
      )
    },
    {
      title: "Language Change Details",
      content: (
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
      )
    },
    {
      title: "Verification Documents",
      content: (
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
      )
    }
  ];

  return (
    <VerificationContent
      title="Verify Language Change Request"
      subtitle="Review and verify tutor's language change request"
      sections={sections}
      approveLoading={approveLoading}
      denyLoading={denyLoading}
      onApprove={() => handleAction('approve')}
      onDeny={() => handleAction('deny')}
    />
  );
};

export default LanguageChangeReview;