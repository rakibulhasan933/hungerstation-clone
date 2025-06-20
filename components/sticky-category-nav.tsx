"use client"

import { useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Flame, Star, Utensils, Coffee, Sandwich, Salad, Pizza } from "lucide-react"

const categories = [
    { id: "bestsellers", name: "Bestsellers", icon: Star, count: 12 },
    { id: "special", name: "Special Offers", icon: Flame, count: 8 },
    { id: "main", name: "Main Course", icon: Utensils, count: 24 },
    { id: "sandwiches", name: "Sandwiches", icon: Sandwich, count: 16 },
    { id: "sides", name: "Side Dishes", icon: Salad, count: 10 },
    { id: "pizza", name: "Pizza", icon: Pizza, count: 14 },
    { id: "drinks", name: "Drinks", icon: Coffee, count: 18 },
]

interface StickyCategoryNavProps {
    activeCategory: string
    onCategoryChange: (categoryId: string) => void
    isSticky: boolean
}

export default function StickyCategoryNav({ activeCategory, onCategoryChange, isSticky }: StickyCategoryNavProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const scrollToCategory = (categoryId: string) => {
        onCategoryChange(categoryId)
        const element = document.getElementById(`category-${categoryId}`)
        if (element) {
            const headerOffset = 140 // Account for sticky header height
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            })
        }
    }

    // Auto-scroll active category into view in horizontal nav
    useEffect(() => {
        const activeButton = document.querySelector(`[data-category="${activeCategory}"]`)
        if (activeButton && scrollContainerRef.current) {
            activeButton.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
            })
        }
    }, [activeCategory])

    return (
        <div
            className={`bg-white border-b shadow-sm transition-all duration-300 z-40 ${isSticky ? "fixed top-0 left-0 right-0" : "relative"
                }`}
        >
            <div className="container mx-auto px-4">
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto scrollbar-hide py-4 gap-2"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {categories.map((category) => {
                        const Icon = category.icon
                        const isActive = activeCategory === category.id

                        return (
                            <Button
                                key={category.id}
                                data-category={category.id}
                                variant={isActive ? "default" : "ghost"}
                                className={`flex-shrink-0 h-12 px-4 transition-all duration-300 ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg scale-105"
                                    : "hover:bg-orange-50 text-gray-700 hover:text-orange-600"
                                    }`}
                                onClick={() => scrollToCategory(category.id)}
                            >
                                <Icon className={`mr-2 h-4 w-4 ${isActive ? "animate-pulse" : ""}`} />
                                <span className="font-medium whitespace-nowrap">{category.name}</span>
                                <Badge
                                    variant={isActive ? "secondary" : "outline"}
                                    className={`ml-2 transition-all duration-300 ${isActive
                                        ? "bg-white/20 text-white border-white/30 animate-bounce"
                                        : "bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-700"
                                        }`}
                                >
                                    {category.count}
                                </Badge>
                            </Button>
                        )
                    })}
                </div>
            </div>

            {/* Animated bottom border */}
            <div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 transform origin-left transition-transform duration-500"
                style={{ transform: isSticky ? "scaleX(1)" : "scaleX(0)" }}
            />
        </div>
    )
}
