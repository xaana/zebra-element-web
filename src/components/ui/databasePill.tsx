import React from 'react';
import { TimelineRenderingType } from 'matrix-react-sdk/src/contexts/RoomContext';
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import { Database, X } from 'lucide-react';

// import { IconDatabase } from './icons';




// Define a functional component
const DatabasePill = ({ database,timelineRenderingType}:{database:string|undefined,timelineRenderingType:TimelineRenderingType}) : React.JSX.Element | null =>  {
  // Styles for the pill container
  const cancelQuoting=(): void =>  {
    dis.dispatch({
        action: "select_database",
        database: "",
        timelineRenderingType,
    });
}

  if (!database) return null;
  return (
    <div className="py-2 px-4 bg-gray-300 rounded-full gap-2 inline-block">
        <div className='flex flex-row items-center'>
        <Database />
      <span>{database}</span>

      <X onClick={()=>cancelQuoting()} className='cursor-pointer' />

      </div>
    </div>
  );
};

export default DatabasePill;
