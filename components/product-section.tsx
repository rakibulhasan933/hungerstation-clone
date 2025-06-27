"use client"

import type React from "react"
import { Plus, Minus, Star, Flame, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useAppSelector } from "@/store/hooks"
import Image from "next/image"

interface ProductSectionProps {
  categoryId: string
  categoryName: string
  products: any[]
  animatingCards: Set<number>
  onProductClick: (product: any) => void
  onQuickAdd: (e: React.MouseEvent, product: any) => void
  onQuickRemove: (e: React.MouseEvent, product: any) => void
}

export default function ProductSection({
  categoryId,
  categoryName,
  products,
  animatingCards,
  onProductClick,
  onQuickAdd,
  onQuickRemove,
}: ProductSectionProps) {
  const { items } = useAppSelector((state) => state.cart)

  const getItemQuantity = (productId: number) => {
    return items.filter((item) => item.id === productId).reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <section id={`category-${categoryId}`} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-28">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{categoryName}</h2>
          <p className="text-sm sm:text-base text-gray-600">{products.length} items available</p>
        </div>
        <Badge variant="outline" className="text-xs sm:text-sm px-2 sm:px-3 py-1">
          {products.length}
        </Badge>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {products.map((product) => {
          const quantity = getItemQuantity(product.id)
          const isAnimating = animatingCards.has(product.id)

          return (
            <Card
              key={product.id}
              className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 shadow-md overflow-hidden ${isAnimating ? "animate-pulse ring-2 ring-orange-400" : ""
                }`}
              onClick={() => onProductClick(product)}
            >
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative h-32 xs:h-36 sm:h-40 lg:h-48 overflow-hidden">
                  <Image
                    src={Array.isArray(product.image) ? product.image[0] : product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    width={300}
                    height={200}
                    priority={false}
                  />

                  {/* Overlay badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isPopular && (
                      <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-0.5">
                        <Star className="w-2.5 h-2.5 mr-1" />
                        Popular
                      </Badge>
                    )}
                    {product.isSpicy && (
                      <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-0.5">
                        <Flame className="w-2.5 h-2.5 mr-1" />
                        Spicy
                      </Badge>
                    )}
                    {product.isNew && (
                      <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-0.5">
                        <Sparkles className="w-2.5 h-2.5 mr-1" />
                        New
                      </Badge>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                    <span className="text-xs font-medium text-gray-900">{product.rating}</span>
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4">
                  <div className="mb-2 sm:mb-3">
                    <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Price and calories */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex flex-col">
                      <span className="text-lg sm:text-xl font-bold text-green-600">₹{product.price.toFixed(0)}</span>
                      <span className="text-xs text-gray-500">{product.calories} kcal</span>
                    </div>
                  </div>

                  {/* Add to cart controls */}
                  <div className="flex items-center  justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs sm:text-sm text-orange-600 hover:text-orange-700  hover:bg-orange-50 px-2 sm:px-3 py-1 sm:py-1.5 box-border border-orange-200 rounded box-shadow bg-slate-100 flex items-center justify-center transition-colors duration-200 "
                      onClick={() => onProductClick(product)}
                    >
                      <Plus className="h-8 w-8 sm:h-4 sm:w-4 mr-1" />
                    </Button>
                  </div>
                </div>

                {/* Animation overlay */}
                {isAnimating && <div className="absolute inset-0 bg-orange-400/20 animate-pulse pointer-events-none" />}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
