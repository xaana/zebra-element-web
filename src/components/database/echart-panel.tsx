import ReactECharts from 'echarts-for-react'
import React from 'react'

import { Loader } from '../ui/loader'

export const EChartPanel = ({
  echartsOption,
  echartsQuery,
}: {
  echartsOption:any | null
  echartsQuery: string | null
}) => {

  const content = echartsOption ? (
    <>
    <div className=''>
      <ReactECharts option={JSON.parse(echartsOption)} />
      </div>
    </>
  ) : <Loader
  className="zexa-flex zexa-justify-center zexa-mt-[100px] zexa-w-full zexa-h-full"
  height="100"
  width="100"
/>

  return (
    <>
    {content}
    </>
  )
}
