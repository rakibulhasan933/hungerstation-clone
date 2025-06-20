"use client"

import type React from "react"

import { Star, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/store/hooks"

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

    if (products.length === 0) {
        return (
            <section id={`category-${categoryId}`} className="scroll-mt-32">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                        <Star className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
                        {categoryName}
                    </h2>
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                        0 items
                    </Badge>
                </div>
                <div className="text-center py-12 text-gray-500">
                    <p>No items available in this category yet.</p>
                </div>
            </section>
        )
    }

    return (
        <section id={`category-${categoryId}`} className="scroll-mt-32">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                    <Star className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
                    {categoryName}
                </h2>
                <Badge variant="outline" className="text-orange-600 border-orange-200">
                    {products.length} items
                </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => {
                    const itemQuantity = getItemQuantity(product.id)
                    const isAnimating = animatingCards.has(product.id)

                    return (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl sm:rounded-2xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer relative"
                            onClick={() => onProductClick(product)}
                        >
                            <div className="relative">
                                <img
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.name}
                                    className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-wrap gap-1 sm:gap-2">
                                    {product.isPopular && <Badge className="bg-orange-500 hover:bg-orange-600 text-xs">Popular</Badge>}
                                    {product.isNew && <Badge className="bg-green-500 hover:bg-green-600 text-xs">New</Badge>}
                                    {product.isSpicy && <Badge className="bg-red-500 hover:bg-red-600 text-xs">🌶️ Spicy</Badge>}
                                </div>
                                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs sm:text-sm font-medium">{product.rating}</span>
                                </div>

                                {/* Enhanced Quantity Indicator */}
                                {itemQuantity > 0 && (
                                    <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
                                        <div className="relative">
                                            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full px-3 sm:px-4 py-1 sm:py-2 shadow-lg flex items-center space-x-1 sm:space-x-2 animate-bounce">
                                                <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4" />
                                                <span className="font-bold text-xs sm:text-sm">{itemQuantity}</span>
                                            </div>
                                            {isAnimating && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-ping"></div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 sm:p-6">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                                <p className="text-gray-600 text-sm mb-3 sm:mb-4 line-clamp-2">{product.description}</p>

                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <div className="flex items-center space-x-2 sm:space-x-4">
                                        <span className="text-xl sm:text-2xl font-bold text-green-600">{product.price.toFixed(1)} SR</span>
                                        <span className="text-xs sm:text-sm text-gray-500">{product.calories} Cal</span>
                                    </div>
                                </div>

                                {/* Enhanced Cart Controls */}
                                {itemQuantity > 0 ? (
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-lg sm:rounded-xl shadow-sm">
                                            <button
                                                onClick={(e) => onQuickRemove(e, product)}
                                                className="p-2 sm:p-3 hover:bg-orange-100 rounded-l-lg sm:rounded-l-xl transition-all duration-200 hover:scale-110"
                                            >
                                                <Minus className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                                            </button>
                                            <div className="px-3 sm:px-4 py-2 sm:py-3 font-bold text-orange-600 min-w-[2.5rem] sm:min-w-[3rem] text-center bg-white/50 text-sm sm:text-base">
                                                {itemQuantity}
                                            </div>
                                            <button
                                                onClick={(e) => onQuickAdd(e, product)}
                                                className="p-2 sm:p-3 hover:bg-orange-100 rounded-r-lg sm:rounded-r-xl transition-all duration-200 hover:scale-110"
                                            >
                                                <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                                            </button>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 sm:py-3 px-3 sm:px-6 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onProductClick(product)
                                            }}
                                        >
                                            Customize
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onProductClick(product)
                                        }}
                                    >
                                        <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                        Add to Cart
                                    </Button>
                                )}
                            </div>

                            {/* Enhanced Animation Effect from Bottom */}
                            {isAnimating && (
                                <div className="absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden">
                                    <div className="relative h-16 sm:h-20">
                                        {/* Multiple animated elements for richer effect */}
                                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-slide-up-bounce">
                                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-2xl flex items-center space-x-2">
                                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                                                <span className="font-bold text-xs sm:text-sm">Added to cart!</span>
                                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                                            </div>
                                        </div>

                                        {/* Sparkle effects */}
                                        <div className="absolute bottom-3 sm:bottom-4 left-1/4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-sparkle-1"></div>
                                        <div className="absolute bottom-4 sm:bottom-6 right-1/4 w-1 h-1 sm:w-1 sm:h-1 bg-orange-400 rounded-full animate-sparkle-2"></div>
                                        <div className="absolute bottom-6 sm:bottom-8 left-1/3 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-red-400 rounded-full animate-sparkle-3"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
