import React from 'react';

const UploadLoader = ({ progress }: { progress: number }) => {
    const circleConfig = {
    viewBox: '0 0 20 20',  // Adjusted viewBox size
    x: '10',  // Center x-coordinate for the new viewBox
    y: '10',  // Center y-coordinate for the new viewBox
    radio: '9'  // Adjusted radius to fit within the new viewBox
  };

  return (
    <figure className="flex flex-col items-center gap-4">
      <svg viewBox={circleConfig.viewBox} className="transform -rotate-90 origin-center w-9 h-9">
        <circle
          className="text-gray-300"
          cx={circleConfig.x}
          cy={circleConfig.y}
          r={circleConfig.radio}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <circle
          className="text-purple-700 opacity-100 transition-all duration-700"
          cx={circleConfig.x}
          cy={circleConfig.y}
          r={circleConfig.radio}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeDasharray={`${progress * 25} ${100 - progress * 25}`}
          strokeDashoffset="25"
        />
      </svg>
    </figure>
  );
};

export default UploadLoader;
