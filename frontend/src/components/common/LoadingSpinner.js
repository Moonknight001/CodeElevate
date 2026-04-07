import React from 'react';

const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClass} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
      />
      {text && <p className="text-gray-500 dark:text-gray-400 text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
