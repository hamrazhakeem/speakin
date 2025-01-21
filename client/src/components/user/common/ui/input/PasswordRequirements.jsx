import React from 'react';
import { ShieldCheck } from 'lucide-react';

const PasswordRequirements = () => {
  const requirements = [
    'At least 8 characters',
    'One uppercase letter',
    'One lowercase letter',
    'One number',
    'One special character'
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
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
            {req}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordRequirements;