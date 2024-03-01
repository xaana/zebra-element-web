

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url
// ).toString()

import React, { useEffect } from "react";

import { Button } from "../ui/button";
import { IconTable } from "../ui/icons";
import { Sheet, SheetContent, SheetPortal } from "../ui/sheet";
import { Citations } from "./citations";


// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const PdfViewer = ({
    roomId,
     // setShowCitations
  }: {
    roomId:string
  }) => {
  const [showCitations, setShowCitations] = React.useState(false)
  const [pdfUrls, setPdfUrls] = React.useState<any>([])
  const [citations, setCitations] = React.useState<any>([])
  

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
            [Uint8Array.from(atob(pdfData.content), c => c.charCodeAt(0))],
            { type: 'application/pdf' }
          )
        ),
        name: pdfData.filename.toString()
      }))
    }
    return []
  }

  useEffect(()=>{
    const url = `http://localhost:8000/api/fetch_pdfs?session_id=${roomId.substring(1).replace(":", "_").split('_')[0]}`
  const temp = new Request(url, {
      method: 'GET',
  });
  if (pdfUrls.length == 0) {
      fetch(temp).then(data=>{if(!data.ok){throw new Error('Network response was not ok');}return data.json()}).then((data)=>
      {

        setPdfUrls(convertToPdfUrls(data))
      }
      ).then(()=>{
          const request = new Request(`http://localhost:8000/api/citations?session_id=${roomId.substring(1).replace(":", "_").split('_')[0]}`, {
              method: 'GET',
  });
          return fetch(request)
      }).then((response)=>{if(!response.ok){throw new Error('Network response was not ok');}return response.json()}).then((data)=>{
        setCitations(data)
      }).then(()=>{
          console.log(citations,pdfUrls,'this.state.citations,this.state.pdfUrls')
          
      })
      .catch((err)=>{
          console.log(err)
      })
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  

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
