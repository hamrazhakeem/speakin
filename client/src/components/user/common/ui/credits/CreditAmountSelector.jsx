import React from 'react';
import { Minus, Plus } from 'lucide-react';

const CreditAmountSelector = ({ 
  credits, 
  setCredits, 
  inputValue, 
  setInputValue, 
  isLoading, 
  maxCredits = Infinity,
  minCredits = 1 
}) => {
  const handleInputChange = (e) => {
    const value = e.target.value;
    
    // Only allow numeric input
    if (value === '' || /^\d+$/.test(value)) {
      setInputValue(value); // Update input value if empty or numeric

      if (value === '') {
        setCredits(minCredits);
      } else {
        const numValue = parseInt(value);
        // Ensure the value is within bounds
        if (numValue >= minCredits && numValue <= maxCredits) {
          setCredits(numValue);
        } else if (numValue > maxCredits) {
          setCredits(maxCredits);
          setInputValue(maxCredits.toString());
        }
      }
    }
  };

  const handleKeyPress = (e) => {
    // Prevent non-numeric keys (except backspace, arrow keys, etc.)
    if (!/^\d$/.test(e.key) && 
        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleBlur = () => {
    if (!inputValue || parseInt(inputValue) < minCredits) {
      setCredits(minCredits);
      setInputValue(minCredits.toString());
    } else if (parseInt(inputValue) > maxCredits) {
      setCredits(maxCredits);
      setInputValue(maxCredits.toString());
    }
  };

  const handlePaste = (e) => {
    // Prevent pasting non-numeric values
    const pastedData = e.clipboardData.getData('text');
    if (!/^\d+$/.test(pastedData)) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <button 
        onClick={() => {
          const newValue = credits - 1;
          if (newValue >= minCredits) {
            setCredits(newValue);
            setInputValue(newValue.toString());
          }
        }}
        disabled={isLoading || credits <= minCredits}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Minus className="w-4 h-4" />
      </button>
      
      <input
        type="text"
        inputMode="numeric"
        pattern="\d*"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        onPaste={handlePaste}
        onBlur={handleBlur}
        disabled={isLoading}
        className="font-semibold text-lg w-20 text-center bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
        placeholder={minCredits.toString()}
      />

      <button 
        onClick={() => {
          const newValue = credits + 1;
          if (newValue <= maxCredits) {
            setCredits(newValue);
            setInputValue(newValue.toString());
          }
        }}
        disabled={isLoading || credits >= maxCredits}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CreditAmountSelector;