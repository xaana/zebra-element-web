import React from 'react';

import { IconKnowledge } from './icons';




// Define a functional component
const KnowledgePrefix = () : React.JSX.Element =>  {
  // Styles for the pill container
  return (
    <div className="px-2 bg-muted rounded-full gap-2 w-fit">
        <div className='flex flex-row text-xs'>
        <IconKnowledge />
        <span>Ziggy</span>
      </div>
    </div>
  );
};

export default KnowledgePrefix;
