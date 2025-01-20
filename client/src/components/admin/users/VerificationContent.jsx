import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../../common/ui/LoadingSpinner';

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

const VerificationContent = ({
  title,
  subtitle,
  sections,
  approveLoading,
  denyLoading,
  onApprove,
  onDeny,
  backUrl = '/admin/manage-users'
}) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate(backUrl)}
            className="flex items-center text-zinc-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </button>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-zinc-400 mt-1">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <Section key={index} title={section.title}>
            {section.content}
          </Section>
        ))}

        <div className="flex justify-end space-x-4 mt-8">
          <button
            className="px-6 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors flex items-center disabled:opacity-50"
            onClick={onDeny}
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
            onClick={onApprove}
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

export { VerificationContent, Section, InfoItem };