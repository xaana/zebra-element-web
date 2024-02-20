import { useEffect } from 'react'

export default function WaveformLoader({
  size = 24,
  speed = 1.05,
  color
}: {
  size?: number | string
  speed?: number | string
  color?: string
}) {
  useEffect(() => {
    async function getLoader() {
      const { waveform } = await import('ldrs')
      waveform.register()
    }
    getLoader()
  }, [])
  return (
    <l-waveform
      color={color ? color : '#000000'}
      size={size}
      speed={speed}
    ></l-waveform>
  )
}
