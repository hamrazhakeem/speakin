import React from 'react';
import { ShieldCheck, Check } from 'lucide-react';

const PasswordRequirements = ({ password = '' }) => {
  const requirements = [
    {
      text: 'At least 8 characters',
      met: password.length >= 8
    },
    {
      text: 'One uppercase letter',
      met: /[A-Z]/.test(password)
    },
    {
      text: 'One lowercase letter',
      met: /[a-z]/.test(password)
    },
    {
      text: 'One number',
      met: /\d/.test(password)
    },
    {
      text: 'One special character',
      met: /[@$!%*?&]/.test(password)
    }
  ];

  return (
    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-medium text-gray-900">Password Requirements</h3>
      </div>
      <ul className="text-sm text-gray-600 space-y-2">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-center gap-2">
            {req.met ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
            )}
            <span className={req.met ? 'text-green-700' : ''}>
              {req.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordRequirements;