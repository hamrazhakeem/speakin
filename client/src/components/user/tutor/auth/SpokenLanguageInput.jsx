import React from 'react';
import { Controller } from 'react-hook-form';

const SpokenLanguageInput = ({ index, languagesSpoken, proficiencies, control, onRemove, errors }) => (
  <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-gray-50 rounded-lg">
    <Controller
      name={`spokenLanguages.${index}.language`}
      control={control}
      rules={{ required: 'Language is required' }}
      render={({ field }) => (
        <>
          <select
            {...field}
            className="w-full sm:w-2/5 p-2 border rounded focus:ring-2 outline-none border-gray-300 focus:ring-blue-500"
          >
            <option value="" disabled>Select Language</option>
            {languagesSpoken.map((spokenLang) => (
              <option key={spokenLang.id} value={spokenLang.name}>
                {spokenLang.name}
              </option>
            ))}
          </select>
          {errors?.spokenLanguages?.[index]?.language && (
            <p className="text-red-500 text-sm">{errors.spokenLanguages[index].language.message}</p>
          )}
        </>
      )}
    />

    <Controller
      name={`spokenLanguages.${index}.proficiency`}
      control={control}
      rules={{ required: 'Proficiency is required' }}
      render={({ field }) => (
        <>
          <select
            {...field}
            className="w-full sm:w-2/5 p-2 border rounded focus:ring-2 outline-none border-gray-300 focus:ring-blue-500"
            disabled={index === 0}
          >
            {index === 0 ? (
              <option value="Native">Native</option>
            ) : (
              <>
                <option value="" disabled>Select Proficiency</option>
                {proficiencies.map((prof, i) => (
                  <option key={i} value={prof.level}>
                    {prof.description}
                  </option>
                ))}
              </>
            )}
          </select>
          {errors?.spokenLanguages?.[index]?.proficiency && (
            <p className="text-red-500 text-sm">{errors.spokenLanguages[index].proficiency.message}</p>
          )}
        </>
      )}
    />

    {index !== 0 && (
      <button
        type="button"
        className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center justify-center gap-2"
        onClick={onRemove}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Remove
      </button>
    )}
  </div>
);

export default SpokenLanguageInput;