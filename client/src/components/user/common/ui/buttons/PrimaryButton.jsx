import { ChevronRight } from "lucide-react";
import LoadingSpinner from "../../../../common/ui/LoadingSpinner";

const PrimaryButton = ({ 
    children, 
    loading = false, 
    disabled = false, 
    onClick,
    type = "button",
    className = "",
    showChevron = true
  }) => {
    return (
        <button
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        className={`w-full h-12 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium transition-colors duration-200 flex items-center justify-center group ${className}`}
        >
        {loading ? (
            <div className="h-5 flex items-center">
            <LoadingSpinner size="sm"/>
            </div>
        ) : (
            <>
            {children}
            {showChevron && <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </>
        )}
        </button>
    );
};
  
export default PrimaryButton;