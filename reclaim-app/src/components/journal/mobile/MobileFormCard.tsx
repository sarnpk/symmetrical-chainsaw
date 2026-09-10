"use client";

import React from 'react';

interface MobileFormCardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  required?: boolean;
  className?: string;
}

export default function MobileFormCard({ 
  children, 
  title, 
  description, 
  required = false,
  className = "" 
}: MobileFormCardProps) {
  return (
    <div className={`overflow-hidden bg-white shadow-sm sm:rounded-lg mb-4 ${className}`}>
      <div className="px-4 py-6 sm:p-6">
        {title && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              {title}
              {required && <span className="text-red-500 text-sm">*</span>}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-gray-600">{description}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}