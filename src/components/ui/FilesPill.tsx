import React from 'react';
import { TimelineRenderingType } from 'matrix-react-sdk/src/contexts/RoomContext';
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import { FileText,X } from 'lucide-react';

import { DocFile } from '../views/rooms/FileSelector';




// Define a functional component
const FilesPill = ({ files,timelineRenderingType}:{files:DocFile[]|undefined,timelineRenderingType:TimelineRenderingType}) : React.JSX.Element | null =>  {
  // Styles for the pill container
  const cancelQuoting=(): void =>  {
    dis.dispatch({
        action: "select_files",
        files: [],
        timelineRenderingType,
    });
}

  if (!files||(files&&files.length===0)) return null;
  
  return (
    <div className="py-2 px-4 bg-gray-300 rounded-full gap-2">
        <div className="relative">
          <X onClick={()=>cancelQuoting()} className='cursor-pointer top-0 right-0 absolute' />
        </div>
        {files&&files.map((file)=>{
            return(
            <div className='flex flex-row' key={file.mediaId}>
                    <FileText />
                <span>{file.fileName}</span>
                </div>)
        })}
    </div>
  );
};

export default FilesPill;
