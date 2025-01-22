import { GraduationCap, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserTypeSelector = ({ selectedType }) => {
    const navigate = useNavigate();

    const handleTypeChange = (type) => {
      if (type === 'student') {
        navigate('/sign-in');
      } else {
        navigate('/tutor/sign-in');
      }
    };

    return (
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => handleTypeChange('student')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-200 ${
            selectedType === 'student' 
              ? 'bg-blue-50 border-blue-200 text-blue-600' 
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <GraduationCap size={20} />
          <span className="font-medium">Student</span>
        </button>
        <button
          onClick={() => handleTypeChange('tutor')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-200 ${
            selectedType === 'tutor' 
              ? 'bg-blue-50 border-blue-200 text-blue-600' 
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <User size={20} />
          <span className="font-medium">Tutor</span>
        </button>
      </div>
    );
};

export default UserTypeSelector;