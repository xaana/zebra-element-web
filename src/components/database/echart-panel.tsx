import { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import React from 'react'

import type { DataItem } from './message-child-database-result'
import { Loader } from '../ui/loader'
import BaseCard from '../../customisations/BaseCard'

// import { Button } from '../ui/button'
// import { IconCheckCircle, IconClose, IconTurium } from '../ui/icons'
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// import { fetcher } from '@/lib/utils'
// import { SessionTokenContext } from '@/context/UserContext'



// const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT
// const ALGOLOGY_DASHBOARD_ID = `f6967db9-a423-4346-8e00-b4c0be12da1b`

export const EChartPanel = ({
  echartsOption,
  echartsQuery,
  onClose
}: {
  echartsOption:any | null
  echartsQuery: string | null
  onClose: () => void
}) => {
//   const [isAddedToAlgology, setIsAddedToAlgology] = useState(false)
//   const sessionToken = useContext(SessionTokenContext)

//   const handleAddToAlgology = async () => {
//     const {
//       data,
//       error
//     }: {
//       data: { status: string; message?: string; url?: string } | null
//       error: Error | null
//     } = await fetcher(`${API_ENDPOINT}/api/echart/mapping`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${sessionToken}`
//       },
//       body: JSON.stringify({
//         dashboard_id: ALGOLOGY_DASHBOARD_ID,
//         echarts_code: echartsCode,
//         query_result: echartsQuery
//       })
//     })
//     if (error) {
//       console.error(error)
//     } else if (data) {
//       if (data.status === 'success') {
//         setIsAddedToAlgology(true)
//         data.url && window.open(data.url, '_blank')
//       } else if (data.message) {
//         console.error(data.message)
//       }
//     }
//   }

  // const dbResultsToEchartsFormat = (inputData: DataItem[]) => {
  //   // Aggregate values for each key
  //   let aggregatedData: { [key: string]: any } = {}

  //   inputData.forEach(item => {
  //     Object.keys(item).forEach(key => {
  //       if (!aggregatedData[key]) {
  //         aggregatedData[key] = []
  //       }
  //       aggregatedData[key].push(item[key])
  //     })
  //   })

  //   // Convert to the desired structure
  //   return {
  //     series: [
  //       {
  //         fields: Object.keys(aggregatedData).map(key => {
  //           return {
  //             values: {
  //               toArray: function () {
  //                 return aggregatedData[key]
  //               }
  //             }
  //           }
  //         })
  //       }
  //     ]
  //   }
  // }
  // useEffect(() => {
  //   if (echartsCode) {
  //     // Convert '\n' to actual new lines
  //     const formattedCode = echartsCode.replace(/\\n/g, '\n')

  //     // Convert string code to function
  //     let generateOption
  //     try {
  //       // eslint-disable-next-line no-new-func
  //       generateOption = new Function('data', formattedCode)
  //     } catch (error) {
  //       console.error('Error parsing echarts code:', error)
  //       return
  //     }

  //     let chart_option = generateOption(dbResultsToEchartsFormat(echartsData)) // Assuming the 'data' is available in this scope.
  //     console.log('setting the chart_option',chart_option)
  //     setOption(() => chart_option)
  //   } else {
  //     setOption(null)
  //   //   setIsAddedToAlgology(false)
  //   }
  // }, [echartsCode])
  console.log(echartsOption)
  const content = echartsOption ? (
    <>
    <div className=''>
      <ReactECharts option={echartsOption} />
      </div>
    </>
  ) : <Loader
  className="zexa-flex zexa-justify-center zexa-mt-[100px] zexa-w-full zexa-h-full"
  height="100"
  width="100"
/>

  return (
    <>
      {/* <div className="zexa-w-full zexa-flex zexa-justify-start">
        <Button
          className=""
          variant={'ghost'}
          size={'icon'}
          onClick={() => setShowEcharts(prev => !prev)}
        >
          <IconClose className="zexa-w-4 zexa-h-4" />
        </Button>
      </div> */}
      <BaseCard className="BasedCard_echarts" onClose={onClose} hideBackButton={true}>
                {content}
      </BaseCard>
      
    </>
  )
}
