import React from 'react';
import { Earth} from 'lucide-react';






// Define a functional component
const WebSearchPill = () : React.JSX.Element | null =>  {
  // Styles for the pill container
//   const cancelQuoting=(): void =>  {
//     dis.dispatch({
//         action: "select_database",
//         database: "",
//         roomId: roomId,
//         context:timelineRenderingType,
//     });
// }

  return (
    <div className="inline-block px-2 bg-muted rounded-full gap-2">
        <div className='flex flex-row text-xs'>
        <Earth size={16} />
      <span>Web Search</span>

      {/* <X onClick={()=>cancelQuoting()} className='cursor-pointer' size={16} /> */}

      </div>
    </div>
  );
};

export default WebSearchPill;
