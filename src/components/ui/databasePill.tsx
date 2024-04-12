import React from 'react';
import { TimelineRenderingType } from 'matrix-react-sdk/src/contexts/RoomContext';
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import { Database, X } from 'lucide-react';

// import { IconDatabase } from './icons';




// Define a functional component
const DatabasePill = ({ database,timelineRenderingType,roomId}:{database:string|undefined,timelineRenderingType:TimelineRenderingType,roomId?:string}) : React.JSX.Element | null =>  {
  // Styles for the pill container
  const cancelQuoting=(): void =>  {
    dis.dispatch({
        action: "select_database",
        database: "",
        roomId: roomId,
        context:timelineRenderingType,
    });
}

  if (!database) return null;
  return (
    <div className="py-2 bg-gray-200 rounded-lg gap-2 inline-block">
        <div className='flex flex-row items-center text-xs'>
        <Database size={16} />
      <span>{database}</span>

      <X onClick={()=>cancelQuoting()} className='cursor-pointer' size={16} />

      </div>
    </div>
  );
};

export default DatabasePill;
