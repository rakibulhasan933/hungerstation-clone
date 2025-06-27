"use client"

import { useState, useEffect } from "react"
import { X, Minus, Plus, Flame, AlertCircle, CheckCircle2, AlertTriangle, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppDispatch } from "@/store/hooks"
import { addItem } from "@/store/cartSlice"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

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
  const [isOpen, setIsOpen] = useState(true)

  const [firstSelection, setFirstSelection] = useState<string[]>([])
  const [secondSelection, setSecondSelection] = useState<string[]>([])

  const [isContentSliding, setIsContentSliding] = useState(false)
  const [slideOffset, setSlideOffset] = useState(0)

  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Effect to handle sliding animation for mobile drawer
  useEffect(() => {
    if (isDesktop) return // Only apply sliding on mobile

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.classList.contains("drawer-scroll-area")) {
        const scrollTop = target.scrollTop
        const maxSlide = 120 // Maximum pixels to slide up
        const slideAmount = Math.min(scrollTop, maxSlide)

        setSlideOffset(slideAmount)
        setIsContentSliding(slideAmount > 0)
      }
    }

    // Add scroll listener to the scrollable content area
    const scrollArea = document.querySelector(".drawer-scroll-area")
    if (scrollArea) {
      scrollArea.addEventListener("scroll", handleScroll, { passive: true })
      return () => scrollArea.removeEventListener("scroll", handleScroll)
    }
  }, [isOpen, isDesktop])

  const firstSectionItems = [
    { id: "egg-hash", label: "Egg Hash Sandwich" },
    { id: "french-egg", label: "French Egg Sandwich" },
    { id: "vegeteriano", label: "Vegeteriano" },
    { id: "pure-wow-turkey", label: "Pure Wow Turkey Sandwich" },
    { id: "sujuk", label: "Sujuk Sandwich" },
  ]
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

    // Save to Redux
    dispatch(addItem(cartItem))

    // Save to localStorage
    try {
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")
      // Add new cart item to the beginning of the array (most recent first)
      const updatedCart = [cartItem, ...existingCart]
      localStorage.setItem("cart", JSON.stringify(updatedCart))
    } catch (e) {
      // Ignore localStorage errors
    }

    setShowSuccess(true)
    setIsSubmitting(false)

    // Close modal after success animation
    setTimeout(() => {
      setIsOpen(false)
      onClose()
    }, 1500)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      onClose()
    }
  }

  // Success state component
  const SuccessState = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full text-center animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Added to Cart!</h3>
        <p className="text-sm sm:text-base text-gray-600">
          {quantity}x {product.name} has been added to your cart
        </p>
      </div>
    </div>
  )

  // Image carousel component
  const ImageCarousel = ({ className = "" }: { className?: string }) => (
    <div className={`relative ${className}`}>
      <Carousel
        className="w-full"
      >
        <CarouselContent>
          {(product.images && product.images.length > 0
            ? product.images
            : ["/bannar.jpg", "/bannar.jpg", "/bannar.jpg"]
          ).map((image: string, index: number) => (
            <CarouselItem key={index}>
              <div
                className={`relative bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 overflow-hidden ${isDesktop ? "h-64 lg:h-80 rounded-lg" : "h-48 xs:h-56 sm:h-64 rounded-t-lg"}`}
              >
                <Image
                  src={image || "/placeholder.svg?height=300&width=500"}
                  alt={`${product.name} image ${index + 1}`}
                  className="w-full h-full object-cover"
                  width={500}
                  height={300}
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {isDesktop && (
          <>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </>
        )}
      </Carousel>
    </div>
  )

  // Form content component
  const FormContent = ({ isDialog = false }: { isDialog?: boolean }) => (
    <div className={`space-y-4 sm:space-y-6 ${isDialog ? "max-h-[60vh] overflow-y-auto" : ""}`}>
      {/* Form Validation Errors */}
      {formErrors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
          <span className="text-red-700 text-xs sm:text-sm">{formErrors.general}</span>
        </div>
      )}
      <DialogHeader className="mb-6 px-4">
        <DialogTitle className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{product.name}</DialogTitle>
        <DialogDescription className="text-base text-gray-600 leading-relaxed">
          {product.fullDescription || product.description}
        </DialogDescription>

        {/* Enhanced Info Icons */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-4">
          <div className="flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-orange-500" />
            <span>6510 kcal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>Allergens</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4 text-blue-500" />
            <span>Nutritional data</span>
          </div>
        </div>
      </DialogHeader>
      {/* First Selection Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Blue Box Selection</h3>
            <p className="text-xs sm:text-sm text-gray-500">{firstSelection.length}/3 selections</p>
          </div>
          <Badge
            variant={firstSelection.length === 3 ? "default" : "secondary"}
            className={`self-start sm:self-auto text-xs ${firstSelection.length === 3 ? "bg-green-500 hover:bg-green-600" : "bg-red-500 text-white"
              }`}
          >
            Required
          </Badge>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {firstSectionItems.map((item) => {
            const isSelected = firstSelection.includes(item.id)
            const isDisabled = !isSelected && firstSelection.length >= 3

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 sm:p-4 border rounded-lg transition-colors ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                  } ${isDisabled ? "opacity-50" : ""}`}
              >
                <label
                  htmlFor={item.id}
                  className={`text-gray-700 text-xs sm:text-sm font-medium cursor-pointer flex-1 pr-3 leading-relaxed ${isDisabled ? "text-gray-400 cursor-not-allowed" : ""
                    }`}
                >
                  {item.label}
                </label>
                <Checkbox
                  id={item.id}
                  checked={isSelected}
                  disabled={isDisabled}
                  onCheckedChange={(checked) => handleFirstSectionChange(item.id, checked as boolean)}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Second Selection Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Green Box Selection</h3>
            <p className="text-xs sm:text-sm text-gray-500">{secondSelection.length}/2 selections</p>
          </div>
          <Badge
            variant={secondSelection.length === 2 ? "default" : "secondary"}
            className={`self-start sm:self-auto text-xs ${secondSelection.length === 2 ? "bg-green-500 hover:bg-green-600" : "bg-red-500 text-white"
              }`}
          >
            Required
          </Badge>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {secondSectionItems.map((item) => {
            const isSelected = secondSelection.includes(item.id)
            const isDisabled = !isSelected && secondSelection.length >= 2

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 sm:p-4 border rounded-lg transition-colors ${isSelected ? "border-green-500 bg-green-50" : "border-gray-200 hover:bg-gray-50"
                  } ${isDisabled ? "opacity-50" : ""}`}
              >
                <label
                  htmlFor={item.id}
                  className={`text-gray-700 text-xs sm:text-sm font-medium cursor-pointer flex-1 pr-3 leading-relaxed ${isDisabled ? "text-gray-400 cursor-not-allowed" : ""
                    }`}
                >
                  {item.label}
                </label>
                <Checkbox
                  id={item.id}
                  checked={isSelected}
                  disabled={isDisabled}
                  onCheckedChange={(checked) => handleSecondSectionChange(item.id, checked as boolean)}
                  className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Enhanced Customizations */}
      {product.customizations && product.customizations.length > 0 && (
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 border-b pb-2">Customize Your Order</h3>
          {product.customizations.map((customization: any) => (
            <div key={customization.id} className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 flex flex-wrap items-center gap-2">
                    <span>{customization.title}</span>
                    {customization.required && (
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">{customization.subtitle}</p>
                </div>
              </div>

              {formErrors.customizations?.[customization.id] && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-red-600 text-xs sm:text-sm leading-relaxed">
                    {formErrors.customizations[customization.id]}
                  </span>
                </div>
              )}

              <div className="space-y-2 sm:space-y-3">
                {customization.options.map((option: any) => (
                  <div
                    key={option.id}
                    className={`flex items-center justify-between p-3 sm:p-4 border rounded-lg transition-colors ${selectedCustomizations[customization.id]?.includes(option.id)
                      ? "border-orange-500 bg-orange-50"
                      : formErrors.customizations?.[customization.id]
                        ? "border-red-200 bg-red-50"
                        : "border-gray-200 hover:bg-gray-50"
                      } cursor-pointer`}
                    onClick={() => {
                      const checked = !(selectedCustomizations[customization.id]?.includes(option.id));
                      handleCustomizationChange(customization.id, option.id, checked);
                    }}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <label
                        htmlFor={option.id}
                        className="text-xs sm:text-sm font-medium cursor-pointer flex-1 leading-relaxed break-words"
                      >
                        {option.name}
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                      {option.price > 0 && (
                        <span className="text-xs font-semibold text-green-600 whitespace-nowrap">+₹{option.price}</span>
                      )}
                      <Checkbox
                        id={option.id}
                        checked={selectedCustomizations[customization.id]?.includes(option.id) || false}
                        onCheckedChange={(checked) => handleCustomizationChange(customization.id, option.id, checked as boolean)}
                        className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Related Items */}
      {product.relatedItems && product.relatedItems.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Often ordered with</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {product.relatedItems.map((item: any) => (
              <div
                key={item.id}
                className={`border rounded-lg p-2 sm:p-3 cursor-pointer transition-all hover:shadow-md ${selectedRelatedItems.includes(item.id)
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
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-12 sm:h-16 object-cover rounded mb-1 sm:mb-2"
                />
                <p className="text-xs font-medium text-center leading-tight">{item.name}</p>
                <p className="text-xs text-green-600 text-center font-semibold">₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  // Quantity and Add to Cart component
  const QuantityAndAddToCart = ({ isDialog = false }: { isDialog?: boolean }) => (
    <div className={`${isDialog ? "border-t pt-4 mt-6" : ""}`}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
        <div className="space-y-2 flex-1">
          <label className="text-xs sm:text-sm font-medium text-gray-700">Quantity</label>
          <div className="flex items-center bg-gray-100 rounded-lg w-fit">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 sm:p-3 hover:bg-gray-200 rounded-l-lg transition-colors disabled:opacity-50"
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            <span className="px-3 sm:px-4 py-2 sm:py-3 font-semibold min-w-[2.5rem] sm:min-w-[3rem] text-center text-sm sm:text-base">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(10, quantity + 1))}
              className="p-2 sm:p-3 hover:bg-gray-200 rounded-r-lg transition-colors disabled:opacity-50"
              disabled={quantity >= 10}
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
          {formErrors.quantity && (
            <p className="text-red-600 text-xs sm:text-sm flex items-center space-x-1">
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span>{formErrors.quantity}</span>
            </p>
          )}
        </div>
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={isSubmitting || firstSelection.length !== 3 || secondSelection.length !== 2}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            <span>Adding...</span>
          </div>
        ) : (
          `Add ₹${(calculateTotalPrice() * quantity).toFixed(0)}`
        )}
      </Button>
    </div>
  )

  if (showSuccess) {
    return <SuccessState />
  }

  // Desktop Dialog
  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <div className=" relative ">
            {/* Left side - Image */}
            <div className="fixed -z-20 ">
              <ImageCarousel />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-white"
                onClick={() => handleOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Right side - Content */}
            <div className="relative flex flex-col p-6 lg:p-8">
              <div className=" flex-1 overflow-y-auto pr-2 bg-white px-4 sm:px-6 rounded-lg shadow-lg max-h-[80vh]">
                <FormContent isDialog={true} />
              </div>

              <QuantityAndAddToCart isDialog={true} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Mobile Drawer
  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent className="max-h-[95vh] bg-inherit">
        <div className="relative mx-auto w-full max-w-sm sm:max-w-2xl">
          <DrawerHeader className="px-0 pb-0 relative">
            {/* Hero Image Carousel */}
            <div className="relative">
              {/* Close Button - Top Left */}
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-white"
                  onClick={() => handleOpenChange(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>

            {/* Sliding Content Container */}
            <div className="relative">
              {/* Content that slides up */}
              <div
                className="bg-white rounded-t-2xl sm:rounded-t-3xl -mt-6 sm:-mt-8 relative z-10 transition-transform duration-300 ease-out shadow-lg"
                style={{
                  transform: `translateY(-${slideOffset}px)`,
                }}
              >
                {/* Handle bar for visual feedback */}
                <div className="flex justify-center pt-3 pb-2">
                  <div
                    className={`w-12 h-1 rounded-full transition-colors duration-300 ${isContentSliding ? "bg-orange-400" : "bg-gray-300"
                      }`}
                  ></div>
                </div>
              </div>
            </div>
          </DrawerHeader>

          <div className="fixed top-0 left-0 w-full h-64 -z-40">
            <ImageCarousel />
          </div>

          {/* Sticky Header - appears when content slides up */}
          {isContentSliding && (
            <div className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between max-w-sm sm:max-w-2xl mx-auto">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex-1 text-center px-4 truncate">
                  {product.name}
                </h3>
                <div className="w-8 h-8 sm:w-10 sm:h-10"></div> {/* Spacer for centering */}
              </div>
            </div>
          )}

          {/* Scrollable Content */}
          <div className="z-20 relative">
            <div className="px-4 bg-inherit sm:px-6 pb-4 sm:pb-6 max-h-[40vh] sm:max-h-[45vh] overflow-y-auto drawer-scroll-area">
              <div className="md:h-96 h-36 bg-inherit" />
              {/* Product Title and Description */}
              <div className="bg-white px-4 rounded-lg shadow-sm mb-4 sm:mb-6 transition-all duration-300">
                <div className="px-4 sm:px-6 pt-2 sm:pt-3">
                  {/* Title that will align with close button when slid up */}
                  <div className="flex items-start justify-between mb-2">
                    <DrawerTitle
                      className={`text-xl sm:text-2xl font-bold text-gray-900 leading-tight flex-1 pr-4 transition-all duration-300 ${isContentSliding ? "text-lg sm:text-xl" : ""
                        }`}
                    >
                      {product.name}
                    </DrawerTitle>
                    {/* Invisible spacer to maintain alignment with close button */}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 opacity-0"></div>
                  </div>

                  <DrawerDescription
                    className={`text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed transition-opacity duration-300 ${isContentSliding ? "opacity-50" : "opacity-100"
                      }`}
                  >
                    {product.fullDescription || product.description}
                  </DrawerDescription>

                  {/* Enhanced Info Icons */}
                  <div
                    className={`flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 transition-opacity duration-300 ${isContentSliding ? "opacity-30" : "opacity-100"
                      }`}
                  >
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                      <span>6510 kcal</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
                      <span>Allergens</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                      <span>Nutritional data</span>
                    </div>
                  </div>
                </div>

                <FormContent />
              </div>
            </div>
          </div>

          {/* Footer with Quantity and Add to Cart */}
          <DrawerFooter className="px-4 sm:px-6 pt-3 sm:pt-4 border-t bg-white">
            <QuantityAndAddToCart />
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return

    const mediaQueryList = window.matchMedia(query)
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches)

    mediaQueryList.addEventListener("change", listener)
    setMatches(mediaQueryList.matches)

    return () => {
      mediaQueryList.removeEventListener("change", listener)
    }
  }, [query])

  return matches
}

