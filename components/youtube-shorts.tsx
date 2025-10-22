'use client'

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { YouTubeShort } from './youtube-short'
import Autoplay from "embla-carousel-autoplay"

export function YouTubeShorts(props: { shorts: string[] }) {
  const { shorts } = props

  if (shorts.length === 1) {
    return (
      <div className='flex items-center justify-center w-full'>
        <div className="aspect-w-9 aspect-h-16 w-full max-w-xs">
          <YouTubeShort youtube={shorts[0]} />
        </div>
      </div>
    )
  }

  return (
    <div className='flex items-center justify-center w-full'>

      <Carousel
        className="w-full max-w-xs"
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
      >
        <CarouselContent>
          {shorts.map((short, index) => (
            <CarouselItem key={index}>

              <YouTubeShort youtube={short} />

            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}