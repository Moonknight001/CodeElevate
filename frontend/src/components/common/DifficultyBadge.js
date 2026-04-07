import React from 'react';

const difficultyConfig = {
  Easy: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30',
  Medium: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30',
  Hard: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30',
};

const DifficultyBadge = ({ difficulty }) => {
  const classes = difficultyConfig[difficulty] || 'text-gray-600 bg-gray-100';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${classes}`}>
      {difficulty}
    </span>
  );
};

export default DifficultyBadge;
