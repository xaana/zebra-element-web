

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url
// ).toString()

import React, { useEffect,useRef,useState } from "react";
import { Filter, MatrixClient, MatrixEvent, Room } from 'matrix-js-sdk/src/matrix';
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import { MediaEventHelper } from "matrix-react-sdk/src/utils/MediaEventHelper";
import DMRoomMap from 'matrix-react-sdk/src/utils/DMRoomMap';

import { Button } from "../ui/button";
import { IconTable } from "../ui/icons";
import { Sheet, SheetContent, SheetPortal } from "../ui/sheet";
// eslint-disable-next-line import/order
import { Citations } from "./citations";
import { FileDownloader } from "matrix-react-sdk/src/utils/FileDownloader";
// import { init as initRouting } from '../../vector/routing';

// import SpaceStore from "matrix-react-sdk/src/stores/spaces/SpaceStore";
// import RoomListStore from "matrix-react-sdk/src/stores/room-list/RoomListStore";



// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const PdfViewer = ({
    roomId,
    citations
     // setShowCitations
  }: {
    roomId:string
    citations: any[]
  }) => {
  const [showCitations, setShowCitations] = useState(false)
  const [pdfUrls, setPdfUrls] = useState<any>([])
  const files = useRef<any[]|undefined>(undefined)
  // const [citations, setCitations] = useState<any>([])
  // const [rooms, setRooms] = useState<Room[]>([]); 
  const [events, setEvents] = useState<MatrixEvent[]>([]);
  const client = useMatrixClientContext();
  const isDirectMessageRoom = (client: MatrixClient, room: Room) => {
    let dmRoomMap = DMRoomMap.shared();
    if (!dmRoomMap) {
      dmRoomMap = DMRoomMap.makeShared(client);
      dmRoomMap.start();
    }
  
    const dmRoomIds = dmRoomMap.getRoomIds();
    return dmRoomIds.has(room.roomId)
  }
  useEffect(() => {
    const fetchFileEventsServer = async (rooms: Room[]) => {
      const dmRooms = [];
      const commonRooms = [];
      for (const room of rooms) {
        if (isDirectMessageRoom(client, room)) {
          dmRooms.push(room);
        } else {
          commonRooms.push(room);
        }
      }
    
      const dmFilter = new Filter(client.getSafeUserId());
      dmFilter.setDefinition({
        room: {
          timeline: {
            contains_url: true,
            types: ["m.room.message"],
          },
        },
      });
    
      dmFilter.filterId = await client.getOrCreateFilter("FILTER_FILES_PLAIN_" + client.credentials.userId, dmFilter);
      const dmTimelineSets = dmRooms.map((room) => room.getOrCreateFilteredTimelineSet(dmFilter));
      const dmEvents = dmTimelineSets.flatMap((ts) => ts.getTimelines().flatMap((t) => t.getEvents()));
    
      const commonFilter = new Filter(client.getSafeUserId());
      commonFilter.setDefinition({
        room: {
          timeline: {
            types: ["m.room.message"],
          },
        },
      });
    
      commonFilter.filterId = await client.getOrCreateFilter("FILTER_FILES_ENCRYPTED_" + client.credentials.userId, commonFilter);
      const commonTimelineSets = commonRooms.map((room) => room.getOrCreateFilteredTimelineSet(commonFilter));
      // const commonEvents = commonTimelineSets.flatMap((ts) => ts.getTimelines().flatMap((t) => t.getEvents()));
      const commonEvents = commonTimelineSets
        .flatMap((ts) => ts.getTimelines().flatMap((t) => t.getEvents()))
        .filter((ev) => ev.getContent().file);
      // console.log(dmEvents, commonEvents)
      setEvents([ ...dmEvents, ...commonEvents]);
    }

    // initRouting();

    const currentRoom = client.getRoom(roomId);
    // setRooms(newRooms);
    console.log('start fetchFileEventsServer...')
    console.log(currentRoom)
    currentRoom&&fetchFileEventsServer([currentRoom]);
    
    // setPdfUrls(files)
  }, []);
  useEffect(() => {
    if (events.length === 0) return
    const tempPdfs = events.map(async (event) => {
      const mxcUrl = event.getContent().url?? event.getContent().file?.url;
      if(!mxcUrl) return
      console.log(mxcUrl)
      console.log('content')
      console.log(event.getContent())
      if (event.isEncrypted()){
        console.log(event.getContent())
        const mediaHelper = new MediaEventHelper(event)
        try {      
          const decryptedBlob = await mediaHelper.sourceUrl.value
          const temp = await mediaHelper.sourceBlob.value
            // If the Blob type is not 'application/pdf', create a new Blob with the correct type
          const temp_pdf = new Blob([temp], { type: 'application/pdf' });
          console.log(decryptedBlob, temp_pdf)
          const pdfUrl = URL.createObjectURL(temp_pdf);
          return {name: event.getContent().body, url: pdfUrl}
        } catch (err) {
          console.log('decryption error', err);
        }
      }
    })
    if (tempPdfs) {
      Promise.all(tempPdfs).then((res) => {
        setPdfUrls(res);
      });
    }
  },[events])

     
  
 
  // if(pdfUrls.length == 0){setPdfUrls(files.current)}
  

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function convertToPdfUrls(source: FileList | any[]) {
    if (source instanceof FileList) {
      return Array.from(source).map(file => ({
        url: URL.createObjectURL(file),
        name: file.name.toString()
      }))
    } else if (Array.isArray(source)) {
      return source.map(pdfData => ({
        url: URL.createObjectURL(
          new Blob(
            [new Uint8Array((pdfData.content))],
            { type: 'application/pdf' }
          )
        ),
        name: pdfData.filename.toString()
      }))
    }
    return []
  }

  // useEffect(()=>{
  //   const url = `http://localhost:8000/api/fetch_pdfs?session_id=${roomId.substring(1).replace(":", "_").split('_')[0]}`
  // const temp = new Request(url, {
  //     method: 'GET',
  // });
  // if (pdfUrls.length == 0) {
  //     fetch(temp).then(data=>{if(!data.ok){throw new Error('Network response was not ok');}return data.json()}).then((data)=>
  //     {

  //       setPdfUrls(convertToPdfUrls(data))
  //     }
  //     ).then(()=>{
  //         const request = new Request(`http://localhost:8000/api/citations?session_id=${roomId.substring(1).replace(":", "_").split('_')[0]}`, {
  //             method: 'GET',
  // });
  //         return fetch(request)
  //     }).then((response)=>{if(!response.ok){throw new Error('Network response was not ok');}return response.json()}).then((data)=>{
  //       setCitations(data)
  //     }).then(()=>{
  //         console.log(citations,pdfUrls,'this.state.citations,this.state.pdfUrls')
          
  //     })
  //     .catch((err)=>{
  //         console.log(err)
  //     })
  // }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // },[])
  

  return (
    <>
    <Button
        variant="secondary"
        className="zexa-font-normal zexa-text-xs zexa-cursor-pointer"
        // onClick={()=>{   
        //     (this.state.pdfUrls&&this.state.citations&&this.state.pdfUrls.length>0&&this.state.citations.length>0)&&
        //     console.log('reach pdf endpoint...')
        //     const jsonData = {
        //         pdfUrls:this.state.pdfUrls,
        //         citations: this.state.citations,
        //         rootId:rootId
        //     };
        //     const request = new Request(`http://localhost:29316/_matrix/maubot/plugin/1/pdf/${roomId}`, {
        //         method: 'POST',
        //         mode: 'no-cors',// This is the part that tries to bypass CORS, but it has limitations
        //         body:JSON.stringify(jsonData)
        //     });
        //     fetch(request)
            
        // }
        // }
                onClick={()=>{setShowCitations(!showCitations)}}
            >
                <IconTable className="zexa-mr-2" />
                {showCitations ? 'Hide Citations' : 'Show Citations'}
        </Button>
    <Sheet
        open={showCitations}
        onOpenChange={(open:boolean)=>setShowCitations(open)}
        modal={false}
        >
        <SheetPortal>
        <SheetContent className="zexa-min-w-[100vw] sm:zexa-min-w-[70vw] lg:zexa-min-w-[50vw] zexa-bg-secondary" side="left">
            <Citations citations={citations} pdfUrls={pdfUrls} />
        {/* <Suspense fallback={<DotPulseLoader />}>
        </Suspense> */}
        {/* <LazyCitations citations={citations} pdfUrls={pdfUrls} /> */}
        </SheetContent>
        </SheetPortal>
    </Sheet>
    </>
  )
}
