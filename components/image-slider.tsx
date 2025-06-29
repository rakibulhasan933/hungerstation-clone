"use client";
import { useState } from "react"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image";



export default function ImageSlider({ images }: { images: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    return (
        <div className="relative w-full h-[220px] md:h-64 bg-muted rounded-lg overflow-hidden shadow-xl">
            <Image
                width={800}
                height={220}
                src={images[currentIndex] || "/placeholder.svg"}
                alt={`Financial slide ${currentIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
            />

            {/* Navigation buttons */}
            <Button

                size="icon"
                onClick={prevImage}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button

                size="icon"

                onClick={nextImage}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Dots indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={cn(
                            "w-3 h-3 rounded-full transition-colors border border-white/50",
                            index === currentIndex ? "bg-white shadow-lg" : "bg-white/60",
                        )}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    )
}