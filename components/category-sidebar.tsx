"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Flame, Star, Utensils, Coffee, Sandwich, Salad, Pizza } from "lucide-react"

const categories = [
  { id: "bestsellers", name: "Bestsellers", icon: Star, count: 12, active: true },
  { id: "special", name: "Special Offers", icon: Flame, count: 8 },
  { id: "main", name: "Main Course", icon: Utensils, count: 24 },
  { id: "sandwiches", name: "Sandwiches", icon: Sandwich, count: 16 },
  { id: "sides", name: "Side Dishes", icon: Salad, count: 10 },
  { id: "pizza", name: "Pizza", icon: Pizza, count: 14 },
  { id: "drinks", name: "Drinks", icon: Coffee, count: 18 },
]
type CategorySidebarProps = {
  orientation?: "horizontal" | "vertical"
}

export default function CategorySidebar({ orientation }: CategorySidebarProps) {
  const [activeCategory, setActiveCategory] = useState("bestsellers")

  if (orientation === "horizontal") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border md:p-4 p-2 flex gap-2 overflow-x-auto">
        {categories.map((category) => {
          const Icon = category.icon
          const isActive = activeCategory === category.id

          return (
            <Button
              key={category.id}
              variant={isActive ? "default" : "ghost"}
              className={` md:h-12 h-10 md:px-4 px-2 flex items-center ${isActive ? "bg-orange-500 hover:bg-orange-600 text-white" : "hover:bg-gray-50 text-gray-700"
                }`}
              onClick={() => setActiveCategory(category.id)}
            >
              <Icon className="mr-2 h-5 w-5" />
              <span className="text-left">{category.name}</span>
              <Badge
                variant={isActive ? "secondary" : "outline"}
                className={`ml-2 ${isActive ? "bg-white/20 text-white border-white/30" : "bg-gray-100 text-gray-600"}`}
              >
                {category.count}
              </Badge>
            </Button>
          )
        })}
      </div>
    )
  }

  // Default vertical sidebar
  return (
    <div className="bg-white rounded-2xl shadow-sm border md:p-4 p-2 sticky top-24">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Categories</h3>
      <div className="space-y-2">
        {categories.map((category) => {
          const Icon = category.icon
          const isActive = activeCategory === category.id

          return (
            <Button
              key={category.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start md:h-12 h-10 md:px-4 px-2 ${isActive ? "bg-orange-500 hover:bg-orange-600 text-white" : "hover:bg-gray-50 text-gray-700"
                }`}
              onClick={() => setActiveCategory(category.id)}
            >
              <Icon className="mr-3 h-5 w-5" />
              <span className="flex-1 text-left">{category.name}</span>
              <Badge
                variant={isActive ? "secondary" : "outline"}
                className={`ml-2 ${isActive ? "bg-white/20 text-white border-white/30" : "bg-gray-100 text-gray-600"}`}
              >
                {category.count}
              </Badge>
            </Button>
          )
        })}
      </div>
    </div>
  )
}