import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Icons for Approve/Deny buttons
import useAxios from '../hooks/useAxios';
import { toast } from 'react-toastify';
import { useState } from 'react';

const AdminVerifyTutorPage = () => {
  const location = useLocation();
  const { state: userData } = location;
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [approveLoading, setApproveLoading] = useState(false);
  const [denyLoading, setDenyLoading] = useState(false);

  const handleAction = async (action) => {
    if (action === 'approve') {
        setApproveLoading(true); // Set loading for approve button
        try {
            await axiosInstance.patch(`users/${userData.id}/verify-tutor/`, {
                action: action
            });
            console.log('Approved');
            toast.success('Tutor Approved Successfully');
            navigate('/admin/manage-users/');
        } catch (error) {
            console.error('Error Approving tutor:', error);
            toast.error('Failed to Approve Tutor');
        } finally {
            setApproveLoading(false); // Reset loading state
        }
        
    } else if (action === 'deny') {
        setDenyLoading(true); // Set loading for deny button
        try {
            await axiosInstance.delete(`users/${userData.id}/verify-tutor/`,{
                action: action
            });
            console.log('Denied');
            toast.success('Tutor Denied Successfully');
            navigate('/admin/manage-users/');
        } catch (error) {
            console.error('Error Denying tutor:', error);
            toast.error('Failed to Deny Tutor');
        } finally {
            setDenyLoading(false); // Reset loading state
        }
    }
};

return (
    <div className="flex flex-col min-h-screen bg-gray-100">
        <AdminNavbar />
        <main className="flex-1 flex justify-center items-center p-4 mt-16 md:mt-24 mb-10">
            <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Verify Tutor Application</h1>

                {userData ? (
                    <div className="space-y-8">
                        <Section title="Personal Information">
                            <InfoItem label="Full Name as in Documents" value={userData.name} />
                            <InfoItem label="Email" value={userData.email} />
                            <InfoItem label="Country" value={userData.country} />
                            <InfoItem label="SpeakIn Name" value={userData.tutor_details.speakin_name} />
                        </Section>

                        <Section title="Languages Spoken">
                            <ul className="list-disc pl-5">
                                {userData.language_spoken.map((lang, index) => (
                                    <li key={index}>{lang.language} ({lang.proficiency})</li>
                                ))}
                            </ul>
                        </Section>

                        <Section title="Tutor Details">
                            <InfoItem label="About" value={userData.tutor_details.about} />
                            {userData.tutor_details.govt_id ? (
                                <InfoItem
                                    label="Government ID"
                                    value={<a href={userData.tutor_details.govt_id} className="text-blue-500 hover:underline">View Government ID</a>}
                                />
                            ) : (
                                <InfoItem
                                    label="Certificate"
                                    value={<a href={userData.tutor_details.certificate} className="text-blue-500 hover:underline">View Certificate</a>}
                                />
                            )}
                            <InfoItem
                                label="Intro Video"
                                value={<a href={userData.tutor_details.intro_video} className="text-blue-500 hover:underline">View Intro Video</a>}
                            />
                            <InfoItem label="Required Credits" value={userData.tutor_details.required_credits} />
                        </Section>

                        <Section title="Language to Teach">
                            <ul className="list-disc pl-5">
                                {userData.tutor_language_to_teach.map((lang, index) => (
                                    <li key={index}>{lang.language} (Native: {lang.is_native ? 'Yes' : 'No'})</li>
                                ))}
                            </ul>
                        </Section>

                        <div className="flex justify-center space-x-4 mt-10">
                            {/* Deny Button */}
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

                            {/* Approve Button */}
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
                    <p className="text-center text-gray-600">No user data available.</p>
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

export default AdminVerifyTutorPage;
