import React from 'react';
import { File } from 'lucide-react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './DropDownMenu';




// Define a functional component
const FilesPrefix = ({ files}:{files: any[]|undefined}) : React.JSX.Element | null =>  {
  // Styles for the pill container
  if (files&&files.length===0) return null;
  return (
    <>
    
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <div className="w-fit px-2 bg-muted rounded-full gap-2 cursor-pointer">
        <div className='flex flex-row text-xs item-center'>
        <File size={16} />
      <span>Files</span>
      </div>
    </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {/* <DropdownMenuLabel>Files</DropdownMenuLabel> */}
        {/* <DropdownMenuSeparator /> */}
        {files&&files.map((file,index) => (
          <DropdownMenuItem key={file.mediaId} disabled className='font-bold'>{`${index+1}. ${file.fileName}`}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  );
};

export default FilesPrefix;
