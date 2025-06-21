"use client"

import { useState } from "react"
import { X, Minus, Plus, Info, Flame, AlertCircle, CheckCircle2, AlertTriangle, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppDispatch } from "@/store/hooks"
import { addItem } from "@/store/cartSlice"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"


interface ProductModalProps {
  product: any
  onClose: () => void
}

interface FormErrors {
  customizations?: Record<string, string>
  quantity?: string
  general?: string
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, string[]>>({})
  const [selectedRelatedItems, setSelectedRelatedItems] = useState<string[]>([])
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const [firstSelection, setFirstSelection] = useState<string[]>([])
  const [secondSelection, setSecondSelection] = useState<string[]>([])

  const firstSectionItems = [
    { id: "egg-hash", label: "Egg Hash Sandwich" },
    { id: "french-egg", label: "French Egg Sandwich" },
    { id: "vegeteriano", label: "Vegeteriano" },
    { id: "pure-wow-turkey", label: "Pure Wow Turkey Sandwich" },
    { id: "sujuk", label: "Sujuk Sandwich" },
  ];
  const secondSectionItems = [
    { id: "egg-hash-2", label: "Egg Hash Sandwich" },
    { id: "french-egg-2", label: "French Egg Sandwich" },
    { id: "vegeteriano-2", label: "Vegeteriano" },
    { id: "pure-wow-turkey-2", label: "Pure Wow Turkey Sandwich" },
    { id: "sujuk-2", label: "Sujuk Sandwich" },
  ]

  const handleFirstSectionChange = (itemId: string, checked: boolean) => {
    if (checked && firstSelection.length < 3) {
      setFirstSelection((prev) => [...prev, itemId])
    } else if (!checked) {
      setFirstSelection((prev) => prev.filter((id) => id !== itemId))
    }
  }

  const handleSecondSectionChange = (itemId: string, checked: boolean) => {
    if (checked && secondSelection.length < 2) {
      setSecondSelection((prev) => [...prev, itemId])
    } else if (!checked) {
      setSecondSelection((prev) => prev.filter((id) => id !== itemId))
    }
  }


  const dispatch = useAppDispatch()

  const handleCheckboxChange = (optionId: string, checked: boolean) => {
    if (checked) {
      setSelectedOptions((prev) => [...prev, optionId])
    } else {
      setSelectedOptions((prev) => prev.filter((id) => id !== optionId))
    }
  }

  const isButtonVisible = selectedOptions.length >= 4

  const handleCustomizationChange = (customizationId: string, optionId: string, checked: boolean) => {
    setSelectedCustomizations((prev) => {
      const current = prev[customizationId] || []
      const customization = product.customizations.find((c: any) => c.id === customizationId)
      const maxSelections = customization?.subtitle.includes("up to")
        ? Number.parseInt(customization.subtitle.match(/\d+/)?.[0] || "1")
        : 1

      let newSelection
      if (checked) {
        if (current.length >= maxSelections) {
          // Replace the first selection if at max
          newSelection = maxSelections === 1 ? [optionId] : [...current.slice(1), optionId]
        } else {
          newSelection = [...current, optionId]
        }
      } else {
        newSelection = current.filter((id) => id !== optionId)
      }

      // Clear errors for this customization
      setFormErrors((prev) => {
        if (!prev.customizations) return prev
        const { [customizationId]: _removed, ...restCustomizations } = prev.customizations
        return {
          ...prev,
          customizations: Object.keys(restCustomizations).length > 0 ? restCustomizations : undefined,
        }
      })

      return { ...prev, [customizationId]: newSelection }
    })
  }

  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    // Validate required customizations
    product.customizations?.forEach((customization: any) => {
      if (customization.required) {
        const selected = selectedCustomizations[customization.id] || []
        if (selected.length === 0) {
          errors.customizations = {
            ...errors.customizations,
            [customization.id]: `Please select ${customization.title.toLowerCase()}`,
          }
        }
      }
    })

    // Validate quantity
    if (quantity < 1) {
      errors.quantity = "Quantity must be at least 1"
    } else if (quantity > 10) {
      errors.quantity = "Maximum quantity is 10"
    }

    setFormErrors(errors)
    return (
      Object.keys(errors).length === 0 && (!errors.customizations || Object.keys(errors.customizations).length === 0)
    )
  }

  const calculateTotalPrice = () => {
    let total = product.price

    // Add customization prices
    Object.entries(selectedCustomizations).forEach(([customizationId, optionIds]) => {
      const customization = product.customizations.find((c: any) => c.id === customizationId)
      if (customization) {
        optionIds.forEach((optionId) => {
          const option = customization.options.find((o: any) => o.id === optionId)
          if (option) {
            total += option.price
          }
        })
      }
    })

    // Add related items prices
    selectedRelatedItems.forEach((itemId) => {
      const item = product.relatedItems.find((i: any) => i.id === itemId)
      if (item) {
        total += item.price
      }
    })

    return total
  }

  const handleAddToCart = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    // Prepare cart item
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      customizations: selectedCustomizations,
      relatedItems: selectedRelatedItems,
      firstSelection: firstSelection,
      secondSelection: secondSelection,
      totalPrice: calculateTotalPrice(),
      addedAt: Date.now(),
    }

    dispatch(addItem(cartItem))

    setShowSuccess(true)
    setIsSubmitting(false)

    // Close modal after success animation
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
          <div className=" w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Added to Cart!</h3>
          <p className="text-gray-600">
            {quantity}x {product.name} has been added to your cart
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="relative">

          <button
            onClick={onClose}
            className="sticky left-4 top-4  z-10  bg-slate-300 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>

          {/* Hero Image */}


          <Carousel
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}>
            <CarouselContent>
              {(product.images && product.images.length > 0
                ? product.images
                : [
                  "/bannar.jpg",
                  "/bannar.jpg",
                  "/bannar.jpg",

                ]
              ).map((image: string, index: number) => (
                <CarouselItem key={index}>
                  <div className="relative h-80 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-t-3xl overflow-hidden">
                    <Image
                      src={image || "/placeholder.svg?height=300&width=500"}
                      alt={`${product.name} image ${index + 1}`}
                      className="w-full fixed h-full object-cover"
                      width={500}
                      height={300}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </CarouselItem>
              ))}

            </CarouselContent>
          </Carousel>
          {/* Product Details */}
          <div className="p-6 space-y-6">
            {/* Product Info */}
            <div className="space-y-4">
              <h2 className="text-2xl sticky z-30 transition ease-in-out delay-150  backdrop-blur-2xl ml-8 top-4  font-bold text-gray-900">{product.name}</h2>
              <p className="text-gray-600 ml-8">{product.fullDescription}</p>

              {/* Enhanced Info Icons */}
              <div className="flex items-center gap-4 text-sm text-gray-500 ml-8">
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4" />
                  <span>6510 kcal</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Allergens</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  <span>Nutritional data</span>
                </div>
              </div>

              {/* Form Validation Errors */}
              {formErrors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-700 text-sm">{formErrors.general}</span>
                </div>
              )}

              {/* First Selection Section */}
              <div className=" space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Blue Box Selection</h3>
                    <p className="text-sm text-gray-500">{firstSelection.length} selections</p>
                  </div>
                  <Badge
                    variant={firstSelection.length === 3 ? "default" : "secondary"}
                    className={firstSelection.length === 3 ? "bg-green-500 hover:bg-green-600" : "bg-red-500 text-gray-600"}
                  >
                    Required
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                {firstSectionItems.map((item) => {
                  const isSelected = firstSelection.includes(item.id)
                  const isDisabled = !isSelected && firstSelection.length >= 3

                  return (
                    <div key={item.id}
                      className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors
                      }`}>
                      <label htmlFor={item.id} className={`text-gray-700 text-sm font-medium cursor-pointer ${isDisabled ? "text-gray-400" : ""}`}>
                        {item.label}
                      </label>
                      <Checkbox
                        checked={isSelected}
                        disabled={isDisabled}
                        onCheckedChange={(checked) => handleFirstSectionChange(item.id, checked as boolean)}
                        className="data-[state=checked]:bg-amber-800 data-[state=checked]:border-amber-800"
                      />
                    </div>
                  )
                })}
              </div>
              {/* Second Selection Section */}
              <div className=" space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Blue Box Selection</h3>
                    <p className="text-sm text-gray-500">{secondSelection.length} selections</p>
                  </div>
                  <Badge
                    variant={secondSelection.length === 2 ? "default" : "secondary"}
                    className={secondSelection.length === 2 ? "bg-green-500 hover:bg-green-600" : "bg-red-500 text-gray-600"}
                  >
                    Required
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                {secondSectionItems.map((item) => {
                  const isSelected = secondSelection.includes(item.id)
                  const isDisabled = !isSelected && secondSelection.length >= 2

                  return (
                    <div key={item.id}
                      className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors
                      }`}>
                      <label htmlFor={item.id} className={`text-gray-700 text-sm font-medium cursor-pointer ${isDisabled ? "text-gray-400" : ""}`}>
                        {item.label}
                      </label>
                      <Checkbox
                        checked={isSelected}
                        disabled={isDisabled}
                        onCheckedChange={(checked) => handleSecondSectionChange(item.id, checked as boolean)}
                        className="data-[state=checked]:bg-amber-800 data-[state=checked]:border-amber-800"
                      />
                    </div>
                  )
                })}
              </div>
              {/* Enhanced Customizations with Validation */}
              {product.customizations && product.customizations.length > 0 && (
                <div className="space-y-6">
                  {product.customizations.map((customization: any) => (
                    <div key={customization.id} className="border-t pt-6">
                      <div className="mb-4">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900">{customization.title}</h3>
                          {customization.required && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{customization.subtitle}</p>
                        {formErrors.customizations?.[customization.id] && (
                          <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>{formErrors.customizations[customization.id]}</span>
                          </p>
                        )}
                      </div>
                      <div className="space-y-3">
                        {/* Customization Options */}
                        {customization.options.map((option: any) => (
                          <div
                            key={option.id}
                            className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors ${formErrors.customizations?.[customization.id] ? "border-red-200 bg-red-50" : "border-gray-200"
                              }`}
                          >
                            <div className="flex items-center space-x-3">

                              <label htmlFor={option.id} className="text-sm font-medium cursor-pointer">
                                {option.name}
                              </label>
                            </div>
                            <div className="flex items-center space-x-3">
                              {option.price > 0 && (
                                <span className="text-[10px] font-semibold text-green-600">(₹{option.price})</span>
                              )}
                              <Checkbox
                                id={option.id}
                                checked={selectedOptions.includes(option.id)}
                                onCheckedChange={(checked) => handleCheckboxChange(option.id, checked as boolean)}
                              />
                            </div>

                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Often ordered with */}
              {product.relatedItems && product.relatedItems.length > 0 && (
                <div className="border-t pt-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Often ordered with</h3>
                    <p className="text-sm text-gray-500">People usually add these items</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {product.relatedItems.map((item: any) => (
                      <div
                        key={item.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${selectedRelatedItems.includes(item.id)
                          ? "border-purple-500 bg-purple-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                          }`}
                        onClick={() => {
                          setSelectedRelatedItems((prev) =>
                            prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id],
                          )
                        }}
                      >
                        <Image
                          width={100}
                          height={100}
                          priority
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-16 object-cover rounded mb-2"
                        />
                        <p className="text-xs font-medium text-center">{item.name}</p>
                        <p className="text-xs text-green-600 text-center font-semibold">₹{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Quantity and Add to Cart */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Quantity</label>
                    <div className="flex items-center bg-gray-100 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-gray-200 rounded-l-lg transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-3 font-semibold min-w-[3rem] text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        className="p-3 hover:bg-gray-200 rounded-r-lg transition-colors"
                        disabled={quantity >= 10}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    {formErrors.quantity && (
                      <p className="text-red-600 text-sm flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{formErrors.quantity}</span>
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={isSubmitting || firstSelection.length !== 3 || secondSelection.length !== 2}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>Adding...</span>
                      </div>
                    ) : (
                      `Add ₹${(calculateTotalPrice() * quantity).toFixed(0)}`
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
