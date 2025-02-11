'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID!;

export default function MetaPixel() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(FB_PIXEL_ID)
        ReactPixel.pageView()
      })
  }, [])

  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.pageView()
      })
  }, [pathname, searchParams])

  return null
}
