import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import useAxios from '../hooks/useAxios';
import { toast } from 'react-hot-toast';
import Avatar from '../components/Avatar';
import { ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const AdminVerifyTutorPage = () => {
  const location = useLocation();
  const { state: userData } = location;
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [approveLoading, setApproveLoading] = useState(false);
  const [denyLoading, setDenyLoading] = useState(false);

  const handleAction = async (action) => {
    const isApprove = action === 'approve';
    const loadingSetter = isApprove ? setApproveLoading : setDenyLoading;

    loadingSetter(true);
    try {
      if (isApprove) {
        await axiosInstance.patch(`users/${userData.id}/verify-tutor/`, { action });
        toast.success('Tutor Approved Successfully');
      } else {
        await axiosInstance.delete(`users/${userData.id}/verify-tutor/`);
        toast.success('Tutor Denied Successfully');
      }
      navigate('/admin/manage-users/');
    } catch (error) {
      console.error(`Error ${isApprove ? 'Approving' : 'Denying'} tutor:`, error);
      toast.error(`Failed to ${isApprove ? 'Approve' : 'Deny'} Tutor`);
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
      ) : (
        <span className="text-white">{value}</span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminNavbar />
      
      <div className="max-w-5xl mx-auto px-4 py-8 pt-24">
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
            <h1 className="text-2xl font-bold text-white">Verify Tutor Application</h1>
            <p className="text-zinc-400 mt-1">Review and verify tutor information</p>
          </div>
        </div>

        {userData ? (
          <div className="space-y-6">
            <Section title="Personal Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem label="Full Name" value={userData.name} />
                <InfoItem label="Email" value={userData.email} />
                <InfoItem label="Country" value={userData.country} />
                <InfoItem label="SpeakIn Name" value={userData.tutor_details.speakin_name} />
                <InfoItem label="Profile Image" value={userData.profile_image} type="link" />
              </div>
            </Section>

            <Section title="Languages Spoken">
              <div className="flex flex-wrap gap-2">
                {userData.language_spoken.map((lang, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full text-sm bg-zinc-800 text-white"
                  >
                    {lang.language} ({lang.proficiency})
                  </span>
                ))}
              </div>
            </Section>

            <Section title="Languages to Teach">
              <div className="flex flex-wrap gap-2">
                {userData.tutor_language_to_teach.map((lang, index) => (
                  <div 
                    key={index}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      lang.is_native 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                    }`}
                  >
                    <div className="font-medium">
                      {lang.language}
                    </div>
                    <div className="text-xs mt-1 opacity-80">
                      {lang.is_native ? 'Native Speaker' : 'Non-Native Speaker'}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Tutor Details">
              <div className="space-y-6">
                <InfoItem label="About" value={userData.tutor_details.about} />
                {userData.tutor_details.govt_id ? (
                  <InfoItem label="Government ID" value={userData.tutor_details.govt_id} type="link" />
                ) : (
                  <InfoItem label="Certificate" value={userData.tutor_details.certificate} type="link" />
                )}
                <InfoItem label="Intro Video" value={userData.tutor_details.intro_video} type="link" />
                <InfoItem label="Required Credits" value={userData.tutor_details.required_credits} />
              </div>
            </Section>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                className="px-6 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors flex items-center disabled:opacity-50"
                onClick={() => handleAction('deny')}
                disabled={denyLoading}
              >
                {denyLoading ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" className="text-white" />
                  </div>
                ) : (
                  <>
                    <FaTimesCircle className="mr-2" /> Deny
                  </>
                )}
              </button>

              <button
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center disabled:opacity-50"
                onClick={() => handleAction('approve')}
                disabled={approveLoading}
              >
                {approveLoading ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" className="text-white" />
                  </div>
                ) : (
                  <>
                    <FaCheckCircle className="mr-2" /> Approve
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-400">No user data available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVerifyTutorPage;
