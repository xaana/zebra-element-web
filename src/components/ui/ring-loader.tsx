import { useEffect } from 'react'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function RingLoader({
  size = 24,
  speed = 1.66,
  color
}: {
  size?: number | string
  speed?: number | string
  color?: string
}) {

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async function getLoader() {
      const { ring } = await import('ldrs')
      ring.register()
    }
    getLoader()
  }, [])
  return (
    <l-ring
      color={color ? color : '#000000'}
      stroke={Number(size) * 0.125}
      size={size}
      speed={speed}
    ></l-ring>
  )
}
