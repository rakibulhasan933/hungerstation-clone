import useMediaQuery from "@/hooks/use-media-query"
import { addItem } from "@/store/cartSlice"
import { useAppDispatch } from "@/store/hooks"
import React, { useState } from "react"
import { Button } from "./ui/button"
import { DrawerClose } from "./ui/drawer"
import { AlertCircle, AlertTriangle, BarChart3, Flame, Minus, Plus, X } from "lucide-react"
import ImageSlider from "./image-slider"
import Image from "next/image"
import { Badge } from "./ui/badge"
import { Checkbox } from "./ui/checkbox"

interface ScrollableContentProps {
    product: any
    onClose: () => void
}
interface FormErrors {
    customizations?: Record<string, string>
    quantity?: string
    general?: string
}




export default function ScrollableContent({ product, onClose }: ScrollableContentProps) {
    const [scrollY, setScrollY] = React.useState(0)
    const [maxScroll, setMaxScroll] = React.useState(0)
    const scrollContainerRef = React.useRef<HTMLDivElement>(null)

    const [open, setOpen] = React.useState(false)
    const [quantity, setQuantity] = React.useState(1)
    const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, string[]>>({})
    const [selectedRelatedItems, setSelectedRelatedItems] = useState<string[]>([])
    const [formErrors, setFormErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [isOpen, setIsOpen] = useState(true)

    const [firstSelection, setFirstSelection] = useState<string[]>([])
    const [secondSelection, setSecondSelection] = useState<string[]>([])


    const isDesktop = useMediaQuery("(min-width: 768px)");

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

    const dispatch = useAppDispatch();

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

        }, 1500)
    }



    // Handle scroll events
    const handleScroll = React.useCallback(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current
            const scrollTop = container.scrollTop
            const scrollHeight = container.scrollHeight - container.clientHeight

            setScrollY(scrollTop)
            setMaxScroll(scrollHeight)
        }
    }, [])

    React.useEffect(() => {
        const container = scrollContainerRef.current
        if (container) {
            container.addEventListener("scroll", handleScroll, { passive: true })
            handleScroll()
            return () => container.removeEventListener("scroll", handleScroll)
        }
    }, [handleScroll])

    // Calculate scroll progress and effects
    const scrollProgress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0
    const textTranslateY = scrollProgress * -1
    const blurAmount = scrollProgress * 4
    const contentOverlapThreshold = 1

    const contentTranslateY =
        scrollY < contentOverlapThreshold ? 0 : Math.min(-1, (scrollY - contentOverlapThreshold) * 1)

    const contentZIndex = scrollY > contentOverlapThreshold ? 60 : 10

    // Sticky title calculations
    const stickyTitleThreshold = 320 // Show sticky title after scrolling 400px
    const showStickyTitle = scrollY > stickyTitleThreshold
    const stickyTitleOpacity = showStickyTitle ? 1 : 0
    const stickyTitleTranslateY = showStickyTitle ? 0 : -50

    return (
        <div className="relative h-full overflow-hidden">
            {/* Sticky Title Bar - appears when scrolling */}
            <div
                className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg transition-all duration-300 ease-out"
                style={{
                    opacity: stickyTitleOpacity,
                    transform: `translateY(${stickyTitleTranslateY}px)`,
                    pointerEvents: showStickyTitle ? "auto" : "none",
                }}
            >
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">

                        <Button
                            variant="outline"
                            size="icon"

                            className="h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-md border-gray-300 hover:border-gray-400 transition-all duration-200"
                            asChild
                        >
                            <DrawerClose  >
                                <X className="h-4 w-4 text-gray-600" />
                            </DrawerClose>
                        </Button>

                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
                        </div>
                    </div>


                </div>
            </div>

            {/* Fixed Image Slider */}
            <div className="absolute top-0 left-0 right-0 z-50">
                <ImageSlider images={product.image} />
            </div>

            {/* Scrollable Container */}
            <div
                ref={scrollContainerRef}
                className="h-full overflow-y-auto pt-[240px] md:pt-[300px] px-4 md:px-6"
                style={{ scrollbarWidth: "thin" }}
            >
                {/* Content with scroll effects */}
                <div
                    className="relative transition-all duration-100 ease-out rounded-2xl"
                    style={{
                        transform: `translateY(${contentTranslateY}px)`,
                        zIndex: contentZIndex,
                    }}
                >
                    <div className="bg-white/95 backdrop-blur-sm border-t-4 border-green-500/20 rounded-2xl">
                        <div className="h-8 md:h-12 bg-gradient-to-b from-transparent to-white/50 rounded-t-2xl"></div>

                        <div className="px-4 md:px-6 pb-4 space-y-6 min-h-screen">
                            {/* Original Title - fades out when sticky title appears */}
                            <div
                                className="flex items-center justify-between pt-4 transition-opacity duration-300"
                                style={{
                                    opacity: showStickyTitle ? 0 : 1,
                                }}
                            >
                                <div>
                                    <h3 className="text-xl font-semibold flex items-center gap-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{product.fullDescription || product.description}</p>
                                </div>
                            </div>
                            {/* Enhanced Info Icons */}
                            <div
                                className={`flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 transition-opacity duration-300 opacity-100"
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

                            {/* Additional content to demonstrate scrolling */}
                            <div className="space-y-6">
                                {/* Form Validation Errors */}

                                {formErrors.general && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-center space-x-2">
                                        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
                                        <span className="text-red-700 text-xs sm:text-sm">{formErrors.general}</span>
                                    </div>
                                )}
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
                            <div className="px-4 sm:px-6 pt-3 sm:pt-4 border-t bg-white">
                                <div className={`${isDesktop ? "border-t pt-4 mt-6" : ""}`}>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}