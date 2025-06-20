"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Star, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ProductModal from "./product-modal"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { updateQuantity, clearLastAddedItem } from "@/store/cartSlice"
import { addItem } from "@/store/cartSlice"
import Image from "next/image"

const products = [
  {
    id: 1,
    name: "Regular Broasted",
    description: "4 pieces of chicken + fries + garlic sauce + coleslaw",
    price: 25.0,
    calories: 1215,
    image: "/poducts.jpg?height=200&width=200",
    rating: 4.8,
    isPopular: true,
    fullDescription: "4 pieces of chicken + fries + garlic sauce + cocktail sauce + bread",
    allergens: ["Gluten", "Dairy"],
    nutritionalInfo: {
      calories: 1215,
      protein: "45g",
      carbs: "85g",
      fat: "65g",
      sodium: "1200mg",
      sugar: "5g",
    },
    customizations: [
      {
        id: "spices",
        title: "Extra Spices Powder For Fries",
        subtitle: "up to 1 selection",
        required: false,
        options: [{ id: "extra-spices", name: "Add Extra Spices Powder For Fries", price: 3 }],
      },
      {
        id: "sauce",
        title: "Extra Sauce",
        subtitle: "choose up to 2",
        required: false,
        options: [
          { id: "garlic", name: "Extra Garlic Sauce", price: 2 },
          { id: "cocktail", name: "Extra Cocktail Sauce", price: 2 },
          { id: "spicy", name: "Spicy Mayo", price: 3 },
        ],
      },
    ],
    relatedItems: [
      { id: "drink1", name: "Coca Cola", price: 5, image: "/poducts.jpg?height=100&width=100" },
      { id: "drink2", name: "Pepsi", price: 5, image: "/poducts.jpg?height=100&width=100" },
      { id: "side1", name: "Extra Fries", price: 8, image: "/poducts.jpg?height=100&width=100" },
    ],
  },
  {
    id: 2,
    name: "Spicy Broasted",
    description: "4 pieces of chicken + fries + garlic sauce + coleslaw",
    price: 25.0,
    calories: 1370,
    image: "/poducts.jpg?height=200&width=200",
    rating: 4.7,
    isSpicy: true,
    fullDescription: "4 pieces of spicy chicken + fries + garlic sauce + cocktail sauce + bread",
    allergens: ["Gluten", "Dairy", "Spicy"],
    nutritionalInfo: {
      calories: 1370,
      protein: "48g",
      carbs: "88g",
      fat: "70g",
      sodium: "1400mg",
      sugar: "6g",
    },
    customizations: [
      {
        id: "spice-level",
        title: "Spice Level",
        subtitle: "choose 1 (required)",
        required: true,
        options: [
          { id: "mild", name: "Mild Spice", price: 0 },
          { id: "medium", name: "Medium Spice", price: 0 },
          { id: "hot", name: "Extra Hot", price: 2 },
        ],
      },
    ],
    relatedItems: [
      { id: "drink1", name: "Coca Cola", price: 5, image: "/poducts.jpg?height=100&width=100" },
      { id: "side2", name: "Coleslaw", price: 6, image: "/poducts.jpg?height=100&width=100" },
    ],
  },
  {
    id: 3,
    name: "Stripes Alreef",
    description: "Marinated and fried chicken slices with garlic sauce",
    price: 22.0,
    calories: 980,
    image: "/poducts.jpg?height=200&width=200",
    rating: 4.6,
    fullDescription: "Marinated and fried chicken slices with garlic sauce and fresh vegetables",
    allergens: ["Gluten"],
    nutritionalInfo: {
      calories: 980,
      protein: "38g",
      carbs: "65g",
      fat: "45g",
      sodium: "1100mg",
      sugar: "4g",
    },
    customizations: [],
    relatedItems: [],
  },
  {
    id: 4,
    name: "Broasted Extra Spicy",
    description: "4 pieces of spicy broasted chicken covered in special sauce",
    price: 28.0,
    calories: 1450,
    image: "/poducts.jpg?height=200&width=200",
    rating: 4.9,
    isSpicy: true,
    isNew: true,
    fullDescription:
      "4 pieces of extra spicy broasted chicken covered in our signature hot sauce + fries + garlic sauce",
    allergens: ["Gluten", "Dairy", "Very Spicy"],
    nutritionalInfo: {
      calories: 1450,
      protein: "52g",
      carbs: "92g",
      fat: "75g",
      sodium: "1500mg",
      sugar: "7g",
    },
    customizations: [],
    relatedItems: [],
  },
  {
    id: 5,
    name: "Family Feast",
    description: "8 pieces of chicken + large fries + 4 garlic sauce + coleslaw",
    price: 45.0,
    calories: 2400,
    image: "/poducts.jpg?height=200&width=200",
    rating: 4.8,
    isPopular: true,
    fullDescription: "8 pieces of chicken + large fries + 4 garlic sauce + coleslaw + bread rolls",
    allergens: ["Gluten", "Dairy"],
    nutritionalInfo: {
      calories: 2400,
      protein: "95g",
      carbs: "180g",
      fat: "125g",
      sodium: "2500mg",
      sugar: "10g",
    },
    customizations: [],
    relatedItems: [],
  },
  {
    id: 6,
    name: "Chicken Burger Deluxe",
    description: "Crispy chicken breast + lettuce + tomato + special sauce",
    price: 18.0,
    calories: 650,
    image: "/poducts.jpg?height=200&width=200",
    rating: 4.5,
    fullDescription: "Crispy chicken breast + lettuce + tomato + special sauce + pickles + cheese",
    allergens: ["Gluten", "Dairy"],
    nutritionalInfo: {
      calories: 650,
      protein: "32g",
      carbs: "45g",
      fat: "35g",
      sodium: "800mg",
      sugar: "3g",
    },
    customizations: [],
    relatedItems: [],
  },
]

export default function ProductGrid() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [animatingCards, setAnimatingCards] = useState<Set<number>>(new Set())

  const dispatch = useAppDispatch()
  const { items, lastAddedItem } = useAppSelector((state) => state.cart)

  const getItemQuantity = (productId: number) => {
    return items.filter((item) => item.id === productId).reduce((sum, item) => sum + item.quantity, 0)
  }

  interface ProductCustomizationOption {
    id: string
    name: string
    price: number
  }

  interface ProductCustomization {
    id: string
    title: string
    subtitle: string
    required: boolean
    options: ProductCustomizationOption[]
  }

  interface ProductRelatedItem {
    id: string
    name: string
    price: number
    image: string
  }

  interface ProductNutritionalInfo {
    calories: number
    protein: string
    carbs: string
    fat: string
    sodium: string
    sugar: string
  }

  interface Product {
    id: number
    name: string
    description: string
    price: number
    calories: number
    image: string
    rating: number
    isPopular?: boolean
    isSpicy?: boolean
    isNew?: boolean
    fullDescription: string
    allergens: string[]
    nutritionalInfo: ProductNutritionalInfo
    customizations: ProductCustomization[]
    relatedItems: ProductRelatedItem[]
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
  }

  const handleCloseModal = () => {
    setSelectedProduct(null)
  }

  const handleQuickAdd = (e: React.MouseEvent, product: any) => {
    e.stopPropagation()
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      customizations: {},
      relatedItems: [],
      totalPrice: product.price,
      addedAt: Date.now(),
    }
    dispatch(addItem(cartItem))
    triggerAnimation(product.id)
  }

  const handleQuickRemove = (e: React.MouseEvent, product: any) => {
    e.stopPropagation()
    const currentQuantity = getItemQuantity(product.id)
    if (currentQuantity > 0) {
      dispatch(updateQuantity({ id: product.id, quantity: currentQuantity - 1 }))
    }
  }

  const triggerAnimation = (productId: number) => {
    setAnimatingCards((prev) => new Set(prev).add(productId))
    setTimeout(() => {
      setAnimatingCards((prev) => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }, 2000)
  }

  useEffect(() => {
    if (lastAddedItem) {
      triggerAnimation(lastAddedItem)
      const timer = setTimeout(() => {
        dispatch(clearLastAddedItem())
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [lastAddedItem, dispatch])

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Star className="mr-2 h-6 w-6 text-orange-500" />
            Bestsellers
          </h2>
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            {products.length} items
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => {
            const itemQuantity = getItemQuantity(product.id)
            const isAnimating = animatingCards.has(product.id)

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer relative"
                onClick={() => handleProductClick(product)}
              >
                <div className="relative">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    width={400}
                    height={300}
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {product.isPopular && <Badge className="bg-orange-500 hover:bg-orange-600">Popular</Badge>}
                    {product.isNew && <Badge className="bg-green-500 hover:bg-green-600">New</Badge>}
                    {product.isSpicy && <Badge className="bg-red-500 hover:bg-red-600">🌶️ Spicy</Badge>}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>

                  {/* Enhanced Quantity Indicator */}
                  {itemQuantity > 0 && (
                    <div className="absolute bottom-4 right-4">
                      <div className="relative">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full px-4 py-2 shadow-lg flex items-center space-x-2 animate-bounce">
                          <ShoppingBag className="h-4 w-4" />
                          <span className="font-bold text-sm">{itemQuantity}</span>
                        </div>
                        {isAnimating && (
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-ping"></div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 relative">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl font-bold text-green-600">{product.price.toFixed(1)} SR</span>
                      <span className="text-sm text-gray-500">{product.calories} Calories</span>
                    </div>
                  </div>

                  {/* Enhanced Cart Controls */}
                  {itemQuantity > 0 ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl shadow-sm">
                        <button
                          onClick={(e) => handleQuickRemove(e, product)}
                          className="p-3 hover:bg-orange-100 rounded-l-xl transition-all duration-200 hover:scale-110"
                        >
                          <Minus className="h-4 w-4 text-orange-600" />
                        </button>
                        <div className="px-4 py-3 font-bold text-orange-600 min-w-[3rem] text-center bg-white/50">
                          {itemQuantity}
                        </div>
                        <button
                          onClick={(e) => handleQuickAdd(e, product)}
                          className="p-3 hover:bg-orange-100 rounded-r-xl transition-all duration-200 hover:scale-110"
                        >
                          <Plus className="h-4 w-4 text-orange-600" />
                        </button>
                      </div>
                      <Button
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleProductClick(product)
                        }}
                      >
                        Customize
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="absolute right-4 bottom-4 flex items-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleProductClick(product)
                      }}
                    >
                      <Plus className="mr-2 flex items-center h-4 w-8 font-bold" />
                    </Button>
                  )}
                </div>

                {/* Enhanced Animation Effect from Bottom */}
                {isAnimating && (
                  <div className="absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden">
                    <div className="relative h-20">
                      {/* Multiple animated elements for richer effect */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-slide-up-bounce">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <span className="font-bold text-sm">Added to cart!</span>
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>

                      {/* Sparkle effects */}
                      <div className="absolute bottom-4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-sparkle-1"></div>
                      <div className="absolute bottom-6 right-1/4 w-1 h-1 bg-orange-400 rounded-full animate-sparkle-2"></div>
                      <div className="absolute bottom-8 left-1/3 w-1.5 h-1.5 bg-red-400 rounded-full animate-sparkle-3"></div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {selectedProduct && <ProductModal product={selectedProduct} onClose={handleCloseModal} />}
    </>
  )
}
