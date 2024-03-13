import { pdfjs } from 'react-pdf'
import { Document, Page } from 'react-pdf'
import { useState, useRef, createRef, useEffect } from 'react'

import { Button } from './../ui/button'
import { IconZoomIn, IconZoomOut } from './../ui/icons'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './../ui/select'
import type { Citation } from './citations-table'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { CitationsTable } from './citations-table'

// eslint-disable-next-line import/order
import debounce from 'lodash.debounce'

import type { BoundingBox } from './citations-table'

// pdfjs.GlobalWorkerOptions.workerSrc = `https://zebra.algoreus.net/pdf.worker.min.js`

import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import React from 'react'
import BaseCard from '../views/BaseCard'
import { Loader } from '../ui/loader'

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url
// ).toString()

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString()
type PageRef = React.RefObject<HTMLDivElement>
export function Citations({
  pdfUrls,
  citations, // setShowCitations
}: {
  pdfUrls: { url: string; name: string }[]
  citations: Citation[]
}) {
  const [numPages, setNumPages] = useState(0)
  const pageRefs = useRef<PageRef[]>([])
  // const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(-1)
  const [highlights, setHighlights] = useState<BoundingBox[]>([])
  const [selectedFileIndex, setSelectedFileIndex] = useState<string>('0')
  const containerRef = useRef<HTMLDivElement>(null)
  const [pendingCitationView, setPendingCitationView] = useState<{
    page: number
    highlights: BoundingBox[]
  } | null>(null)
  const onDocumentLoadSuccess = async ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    pageRefs.current = Array(numPages)
      .fill(null)
      .map((_, i) => pageRefs.current[i] || createRef())

    setTimeout(() => {
      if (pendingCitationView) {
        setHighlights(() => pendingCitationView.highlights)
        // scrollToPage(pendingCitationView.page)
        setPendingCitationView(() => null)
      }
    }, 500)
  }

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth =
          containerRef.current.getBoundingClientRect().width
        setScale(containerWidth / 650)
      }
    }

    // Create a debounced version of your updateScale function
    const debouncedUpdateScale = debounce(updateScale, 250)

    // Call your function directly the first time
    updateScale()

    // Use the debounced function for the resize event
    window.addEventListener('resize', debouncedUpdateScale)

    return () => {
      debouncedUpdateScale.cancel() // Important: Cancel any queued debounced functions on cleanup
      window.removeEventListener('resize', debouncedUpdateScale)
    }
  }, [])

  // const scrollToPage = (page: number) => {
  //   pageRefs.current[page - 1].current?.scrollIntoView({
  //     behavior: 'smooth'
  //   })
  // }

  useEffect(() => {
    // Find the page container div and append highlights
    if (highlights.length === 0) return
    const pageDiv = pageRefs.current[(highlights[0]?.page || 1) - 1]?.current
    if (pageDiv) {
      // Remove existing highlights if any
      pageDiv.querySelectorAll('.bbox').forEach(el => el.remove())
      // Append new highlights
      highlights.forEach(box => {
        const highlightDiv = document.createElement('div')
        highlightDiv.classList.add(
          'bbox',
          'zexa-absolute',
          'zexa-bg-yellow-400',
          'zexa-bg-opacity-30',
          'zexa-rounded'
        )
        highlightDiv.style.left = `${box.x1 * scale}px`
        highlightDiv.style.top = `${box.y1 * scale}px`
        highlightDiv.style.width = `${(box.x2 - box.x1) * scale}px`
        highlightDiv.style.height = `${(box.y2 - box.y1) * scale}px`
        pageDiv.appendChild(highlightDiv)
        highlightDiv.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      })
    }
  }, [scale, highlights])

  const handleViewCitation = async (
    documentName: string,
    pageNumber: string,
    bboxes: BoundingBox[]
  ) => {
    if (Array.from(pdfUrls).length > 1) {
      const newFileIndex = String(
        Array.from(pdfUrls).findIndex(file => file.name === documentName)
      )
      setSelectedFileIndex(newFileIndex)
    }
    if (
      String(
        Array.from(pdfUrls).findIndex(file => file.name === documentName)
      ) !== selectedFileIndex
    ) {
      // Set pending view actions to be applied after the document loads
      setPendingCitationView({
        page: parseInt(pageNumber),
        highlights: bboxes.map(box => ({ ...box, page: parseInt(pageNumber) }))
      })
    } else {
      // setCurrentPage(() => parseInt(pageNumber))
      // scrollToPage(parseInt(pageNumber))
      setHighlights(() =>
        bboxes.map(box => ({ ...box, page: parseInt(pageNumber) }))
      )
    }
  }
  {console.log(pdfUrls,citations)}
  return (
    <>

    {(pdfUrls && citations)?
    <div className="zexa-flex zexa-flex-col zexa-gap-y-3 zexa-h-full">
      <div className="zexa-basis-3/5 zexa-min-h-[300px] zexa-overflow-hidden zexa-flex zexa-flex-col zexa-grow zexa-shrink-0">
        <div className="zexa-flex zexa-items-center zexa-justify-between zexa-pt-4 zexa-pb-2">
          <div className="zexa-basis-1/2">
            <Select
              value={selectedFileIndex}
              onValueChange={value => setSelectedFileIndex(value)}
            >
              <SelectTrigger className="file__select zexa-h-auto zexa-py-2 zexa-text-xs">
                <SelectValue placeholder="Select PDF File" />
              </SelectTrigger>
              <SelectContent asChild>
                {pdfUrls &&
                  Array.from(pdfUrls).map((file, index) => (
                    <SelectItem
                      key={index}
                      value={String(index)}
                      className="zexa-text-xs"
                    >
                      {file.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="zexa-flex zexa-items-center">
            <Button
              className="zexa-sticky zexa-right-0 zexa-top-0 zexa-z-10 !zexa-m-0"
              variant="ghost"
              size="icon"
              onClick={() => setScale(scale - 0.1)}
            >
              <IconZoomOut className="zexa-h-4 zexa-w-4 dark:fill-white group-[.maximised]/main:xl:zexa-h-5 group-[.maximised]/main:xl:zexa-w-5" />
            </Button>
            <Button
              className="zexa-sticky zexa-right-0 zexa-top-0 zexa-z-10 !zexa-m-0"
              variant="ghost"
              size="icon"
              onClick={() => setScale(scale + 0.1)}
            >
              <IconZoomIn className="zexa-h-4 zexa-w-4 dark:fill-white group-[.maximised]/main:xl:zexa-h-5 group-[.maximised]/main:xl:zexa-w-5" />
            </Button>
          </div>
        </div>
        <div className="zexa-rounded-lg zexa-border zexa-overflow-hidden">
          <div
            ref={containerRef}
            className="pdf__container zexa-min-h-[50%] zexa-max-h-full zexa-bg-background zexa-p-2 zexa-overflow-auto scrollbar--custom"
          >
            {pdfUrls.length > 0 && (
              <Document
                file={pdfUrls[Number(selectedFileIndex)]}
                onLoadSuccess={onDocumentLoadSuccess}
                className="zexa-relative"
              >
                {Array.from(new Array(numPages), (_, index) => (
                  <Page
                    className={`page_${index + 1} zexa-relative`}
                    renderAnnotationLayer={false}
                    pageNumber={index + 1}
                    scale={scale}
                    inputRef={pageRefs.current[index]}
                    key={index}
                  />
                ))}
              </Document>
            )}
          </div>
        </div>
      </div>
      <div className="zexa-shrink-0 zexa-basis-2/5 zexa-rounded-md zexa-border zexa-overflow-hidden">
        <div className="zexa-bg-background zexa-h-full zexa-w-full zexa-overflow-auto scrollbar--custom">
          <CitationsTable
            data={citations}
            onViewCitation={handleViewCitation}
          />
        </div>
      </div>
    </div>: <Loader
  className="zexa-flex zexa-justify-center zexa-mt-[100px] zexa-w-full zexa-h-full"
  height="100"
  width="100"
/>}
</>
  )
}
