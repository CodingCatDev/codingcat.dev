'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { YouTubeShort } from './youtube-short'
import Autoplay from "embla-carousel-autoplay"

export function YouTubeShorts(props: { shorts: string[] }) {
  const { shorts } = props
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  if (!shorts?.length) return (<></>);

  if (shorts?.length === 1) {
    return (
      <div className='flex items-center justify-center w-full'>
        <div className="aspect-w-9 aspect-h-16 w-full max-w-xs">
          <YouTubeShort youtube={shorts[0]} isActive={true} />
        </div>
      </div>
    )
  }

  return (
    <div className='flex items-center justify-center w-full'>
      <Carousel
        setApi={setApi}
        className="w-full max-w-xs"
      // plugins={[
      //   Autoplay({
      //     delay: 2000,
      //   }),
      // ]}
      >
        <CarouselContent>
          {shorts.map((short, index) => (
            <CarouselItem key={index}>

              <YouTubeShort youtube={short} isActive={index === current} />

            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}