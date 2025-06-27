"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Flame, Star, Utensils, Coffee, Sandwich, Salad, Pizza } from "lucide-react"

interface ResponsiveCategoryNavProps {
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
  isSticky: boolean
}

const categories = [
  { id: "bestsellers", name: "Bestsellers", icon: Star, count: 12 },
  { id: "special", name: "Special Offers", icon: Flame, count: 8 },
  { id: "main", name: "Main Course", icon: Utensils, count: 24 },
  { id: "sandwiches", name: "Sandwiches", icon: Sandwich, count: 16 },
  { id: "sides", name: "Side Dishes", icon: Salad, count: 10 },
  { id: "pizza", name: "Pizza", icon: Pizza, count: 14 },
  { id: "drinks", name: "Drinks", icon: Coffee, count: 18 },
]

export default function ResponsiveCategoryNav({
  activeCategory,
  onCategoryChange,
  isSticky,
}: ResponsiveCategoryNavProps) {
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    onCategoryChange(categoryId)
  }

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      const newScrollLeft =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const handleResize = () => checkScrollButtons()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={`lg:hidden transition-all duration-300 ${
        isSticky
          ? "fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm"
          : "bg-white border-b"
      }`}
    >
      <div className="relative">
        {/* Left scroll button */}
        {showLeftArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-md hover:bg-white w-8 h-8 sm:w-10 sm:h-10"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        )}

        {/* Right scroll button */}
        {showRightArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-md hover:bg-white w-8 h-8 sm:w-10 sm:h-10"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        )}

        {/* Scrollable categories */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide px-3 sm:px-4 py-2 sm:py-3 space-x-2 sm:space-x-3"
          onScroll={checkScrollButtons}
        >
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = activeCategory === category.id

            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "outline"}
                className={`flex-shrink-0 h-10 sm:h-12 px-3 sm:px-4 transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg border-none"
                    : "bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 border-gray-200 hover:border-orange-200"
                }`}
                onClick={() => scrollToCategory(category.id)}
              >
                <Icon className={`mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 ${isActive ? "animate-pulse" : ""}`} />
                <span className="font-medium text-xs sm:text-sm whitespace-nowrap">{category.name}</span>
                <Badge
                  variant={isActive ? "secondary" : "outline"}
                  className={`ml-1.5 sm:ml-2 text-xs transition-all duration-300 ${
                    isActive
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-700"
                  }`}
                >
                  {category.count}
                </Badge>
              </Button>
            )
          })}
        </div>

        {/* Gradient overlays for scroll indication */}
        {showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        )}
        {showRightArrow && (
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        )}
      </div>
    </div>
  )
}
