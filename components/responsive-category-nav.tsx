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

interface ResponsiveCategoryNavProps {
    activeCategory: string
    onCategoryChange: (categoryId: string) => void
    isSticky: boolean
}

export default function ResponsiveCategoryNav({
    activeCategory,
    onCategoryChange,
    isSticky,
}: ResponsiveCategoryNavProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const scrollToCategory = (categoryId: string) => {
        onCategoryChange(categoryId)
        const element = document.getElementById(`category-${categoryId}`)
        if (element) {
            const headerOffset = window.innerWidth < 768 ? 120 : window.innerWidth < 1024 ? 100 : 80
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            })
        }
    }

    // Auto-scroll active category into view
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
        <>
            {/* Mobile & Tablet Navigation (< lg) */}
            <div className="lg:hidden">
                <div
                    className={`bg-white/95 backdrop-blur-sm border-b shadow-sm transition-all duration-300 z-50 ${isSticky ? "fixed top-0 left-0 right-0" : "relative"
                        }`}
                >
                    <div className="w-full px-2 sm:px-4">
                        <div
                            ref={scrollContainerRef}
                            className="flex overflow-x-auto scrollbar-hide py-3 gap-1 sm:gap-2"
                            style={{
                                scrollbarWidth: "none",
                                msOverflowStyle: "none",
                                WebkitOverflowScrolling: "touch",
                            }}
                        >
                            {categories.map((category) => {
                                const Icon = category.icon
                                const isActive = activeCategory === category.id

                                return (
                                    <Button
                                        key={category.id}
                                        data-category={category.id}
                                        variant={isActive ? "default" : "ghost"}
                                        size="sm"
                                        className={`flex-shrink-0 h-10 sm:h-12 px-2 sm:px-4 text-xs sm:text-sm transition-all duration-300 ${isActive
                                            ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg scale-105"
                                            : "hover:bg-orange-50 text-gray-700 hover:text-orange-600"
                                            }`}
                                        onClick={() => scrollToCategory(category.id)}
                                    >
                                        <Icon className={`mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 ${isActive ? "animate-pulse" : ""}`} />
                                        <span className="font-medium whitespace-nowrap hidden xs:inline">{category.name}</span>
                                        <span className="font-medium whitespace-nowrap xs:hidden">{category.name.split(" ")[0]}</span>
                                        <Badge
                                            variant={isActive ? "secondary" : "outline"}
                                            className={`ml-1 sm:ml-2 text-xs transition-all duration-300 ${isActive
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
            </div>

            {/* Desktop Navigation (>= lg) */}
            <div className="hidden lg:block">
                <div
                    className={`bg-white/95 backdrop-blur-sm border-r shadow-sm transition-all duration-300 z-40 ${isSticky ? "fixed top-0 left-0 bottom-0 w-80" : "relative w-80"
                        }`}
                >
                    <div className="p-4 xl:p-6 h-full overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                        <div className="space-y-2">
                            {categories.map((category) => {
                                const Icon = category.icon
                                const isActive = activeCategory === category.id

                                return (
                                    <Button
                                        key={category.id}
                                        data-category={category.id}
                                        variant={isActive ? "default" : "ghost"}
                                        className={`w-full justify-start h-12 px-4 transition-all duration-300 ${isActive
                                            ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg scale-105 border-l-4 border-orange-300"
                                            : "hover:bg-orange-50 text-gray-700 hover:text-orange-600 hover:border-l-4 hover:border-orange-200"
                                            }`}
                                        onClick={() => scrollToCategory(category.id)}
                                    >
                                        <Icon className={`mr-3 h-5 w-5 ${isActive ? "animate-pulse" : ""}`} />
                                        <span className="font-medium flex-1 text-left">{category.name}</span>
                                        <Badge
                                            variant={isActive ? "secondary" : "outline"}
                                            className={`transition-all duration-300 ${isActive
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

                    {/* Animated side border */}
                    <div
                        className="absolute top-0 right-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 to-red-500 transform origin-top transition-transform duration-500"
                        style={{ transform: isSticky ? "scaleY(1)" : "scaleY(0)" }}
                    />
                </div>
            </div>
        </>
    )
}
