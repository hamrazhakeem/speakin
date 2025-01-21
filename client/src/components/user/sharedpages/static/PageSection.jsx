import React from 'react';
import { ArrowRight, ChevronRight, MessageCircle } from 'lucide-react';

export const HeroSection = ({ 
  badge, 
  title, 
  description, 
  icon: Icon,
  className = "" 
}) => {
  return (
    <section className={`pt-20 pb-16 bg-blue-600 relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px)] bg-[size:14px_14px]"></div>
      <div className="relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {badge && (
              <div className="flex justify-center mb-8">
                {badge}
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {title}
            </h1>
            <p className="text-xl text-blue-50 max-w-2xl mx-auto">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ContentSection = ({ 
  title, 
  description, 
  children, 
  className = "", 
  bgWhite = false,
  maxWidth = "7xl"
}) => {
  return (
    <section className={`py-16 ${bgWhite ? 'bg-white' : ''} ${className}`}>
      <div className={`max-w-${maxWidth} mx-auto px-4 sm:px-6 lg:px-8`}>
        {(title || description) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>}
            {description && <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export const CTASection = ({ 
  title, 
  description, 
  children, 
  badge,
  icon: Icon = MessageCircle 
}) => {
  return (
    <section className="py-20 bg-blue-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px)] bg-[size:14px_14px]"></div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {badge && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm font-medium mb-8">
              <Icon className="w-4 h-4" />
              {badge}
            </div>
          )}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {description}
          </p>
          {children}
        </div>
      </div>
    </section>
  );
};

// New component for legal/privacy content sections
export const LegalContentSection = ({ sections }) => {
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 text-sm font-bold">
                  {index + 1}
                </div>
                {section.title.substring(2)}
              </h2>
              <div className="space-y-4">
                {section.content.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2.5"></div>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">
                      {typeof item === 'string' ? item.substring(4) : item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ContactButton = ({ children }) => {
  return (
    <button className="group px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2 mx-auto">
      {children}
      <ChevronRight className="group-hover:translate-x-1 transition-transform" />
    </button>
  );
};