import React from 'react';

import { IconDatabase } from './icons';




// Define a functional component
const DatabasePrefix = ({ database}:{database:string|undefined}) : React.JSX.Element | null =>  {
  // Styles for the pill container
  if (!database) return null;
  return (
    <div className="inline-block px-2 bg-gray-300 rounded-full gap-2">
        <div className='flex flex-row text-xs'>
        <IconDatabase />
      <span>{database}</span>
      </div>
    </div>
  );
};

export default DatabasePrefix;
