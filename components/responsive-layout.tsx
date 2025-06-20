"use client"

import { useState, useEffect, useRef } from "react"
import type React from "react"
import ProductModal from "./product-modal"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { updateQuantity, clearLastAddedItem, addItem } from "@/store/cartSlice"
import ResponsiveCategoryNav from "./responsive-category-nav"
import ProductSection from "./product-section"

// Sample data organized by categories
const productsByCategory = {
    bestsellers: [
        {
            id: 1,
            name: "Regular Broasted",
            description: "4 pieces of chicken + fries + garlic sauce + coleslaw",
            price: 25.0,
            calories: 1215,
            image: "/placeholder.svg?height=200&width=200",
            rating: 4.8,
            isPopular: true,
            fullDescription: "4 pieces of chicken + fries + garlic sauce + cocktail sauce + bread",
            allergens: ["Gluten", "Dairy"],
            nutritionalInfo: { calories: 1215, protein: "45g", carbs: "85g", fat: "65g", sodium: "1200mg", sugar: "5g" },
            customizations: [
                {
                    id: "spices",
                    title: "Extra Spices Powder For Fries",
                    subtitle: "up to 1 selection",
                    required: false,
                    options: [{ id: "extra-spices", name: "Add Extra Spices Powder For Fries", price: 3 }],
                },
            ],
            relatedItems: [{ id: "drink1", name: "Coca Cola", price: 5, image: "/placeholder.svg?height=100&width=100" }],
        },
        {
            id: 2,
            name: "Spicy Broasted",
            description: "4 pieces of chicken + fries + garlic sauce + coleslaw",
            price: 25.0,
            calories: 1370,
            image: "/placeholder.svg?height=200&width=200",
            rating: 4.7,
            isSpicy: true,
            fullDescription: "4 pieces of spicy chicken + fries + garlic sauce + cocktail sauce + bread",
            allergens: ["Gluten", "Dairy", "Spicy"],
            nutritionalInfo: { calories: 1370, protein: "48g", carbs: "88g", fat: "70g", sodium: "1400mg", sugar: "6g" },
            customizations: [],
            relatedItems: [],
        },
    ],
    special: [
        {
            id: 3,
            name: "Family Feast",
            description: "8 pieces of chicken + large fries + 4 garlic sauce + coleslaw",
            price: 45.0,
            calories: 2400,
            image: "/placeholder.svg?height=200&width=200",
            rating: 4.8,
            isPopular: true,
            fullDescription: "8 pieces of chicken + large fries + 4 garlic sauce + coleslaw + bread rolls",
            allergens: ["Gluten", "Dairy"],
            nutritionalInfo: { calories: 2400, protein: "95g", carbs: "180g", fat: "125g", sodium: "2500mg", sugar: "10g" },
            customizations: [],
            relatedItems: [],
        },
    ],
    main: [
        {
            id: 4,
            name: "Broasted Extra Spicy",
            description: "4 pieces of spicy broasted chicken covered in special sauce",
            price: 28.0,
            calories: 1450,
            image: "/placeholder.svg?height=200&width=200",
            rating: 4.9,
            isSpicy: true,
            isNew: true,
            fullDescription:
                "4 pieces of extra spicy broasted chicken covered in our signature hot sauce + fries + garlic sauce",
            allergens: ["Gluten", "Dairy", "Very Spicy"],
            nutritionalInfo: { calories: 1450, protein: "52g", carbs: "92g", fat: "75g", sodium: "1500mg", sugar: "7g" },
            customizations: [],
            relatedItems: [],
        },
    ],
    sandwiches: [
        {
            id: 5,
            name: "Chicken Burger Deluxe",
            description: "Crispy chicken breast + lettuce + tomato + special sauce",
            price: 18.0,
            calories: 650,
            image: "/placeholder.svg?height=200&width=200",
            rating: 4.5,
            fullDescription: "Crispy chicken breast + lettuce + tomato + special sauce + pickles + cheese",
            allergens: ["Gluten", "Dairy"],
            nutritionalInfo: { calories: 650, protein: "32g", carbs: "45g", fat: "35g", sodium: "800mg", sugar: "3g" },
            customizations: [],
            relatedItems: [],
        },
    ],
    sides: [
        {
            id: 6,
            name: "Stripes Alreef",
            description: "Marinated and fried chicken slices with garlic sauce",
            price: 22.0,
            calories: 980,
            image: "/placeholder.svg?height=200&width=200",
            rating: 4.6,
            fullDescription: "Marinated and fried chicken slices with garlic sauce and fresh vegetables",
            allergens: ["Gluten"],
            nutritionalInfo: { calories: 980, protein: "38g", carbs: "65g", fat: "45g", sodium: "1100mg", sugar: "4g" },
            customizations: [],
            relatedItems: [],
        },
    ],
    pizza: [
        {
            id: 7,
            name: "Margherita Pizza",
            description: "Fresh mozzarella + tomato sauce + basil",
            price: 32.0,
            calories: 1200,
            image: "/placeholder.svg?height=200&width=200",
            rating: 4.4,
            fullDescription: "Fresh mozzarella cheese, tomato sauce, and fresh basil on thin crust",
            allergens: ["Gluten", "Dairy"],
            nutritionalInfo: { calories: 1200, protein: "40g", carbs: "120g", fat: "50g", sodium: "1800mg", sugar: "8g" },
            customizations: [],
            relatedItems: [],
        },
    ],
    drinks: [
        {
            id: 8,
            name: "Fresh Orange Juice",
            description: "Freshly squeezed orange juice",
            price: 8.0,
            calories: 120,
            image: "/placeholder.svg?height=200&width=200",
            rating: 4.3,
            fullDescription: "100% fresh orange juice, no added sugar or preservatives",
            allergens: [],
            nutritionalInfo: { calories: 120, protein: "2g", carbs: "28g", fat: "0g", sodium: "2mg", sugar: "24g" },
            customizations: [],
            relatedItems: [],
        },
    ],
}

const categoryNames = {
    bestsellers: "Bestsellers",
    special: "Special Offers",
    main: "Main Course",
    sandwiches: "Sandwiches",
    sides: "Side Dishes",
    pizza: "Pizza",
    drinks: "Drinks",
}

export default function ResponsiveLayout() {
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [animatingCards, setAnimatingCards] = useState<Set<number>>(new Set())
    const [activeCategory, setActiveCategory] = useState("bestsellers")
    const [isSticky, setIsSticky] = useState(false)
    const stickyRef = useRef<HTMLDivElement>(null)

    const dispatch = useAppDispatch()
    const { items, lastAddedItem } = useAppSelector((state) => state.cart)

    // Intersection Observer for category detection
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "-120px 0px -50% 0px", // Unified margin for all screen sizes
            threshold: 0.1,
        }

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const categoryId = entry.target.id.replace("category-", "")
                    setActiveCategory(categoryId)
                }
            })
        }

        const observer = new IntersectionObserver(observerCallback, observerOptions)

        // Observe all category sections
        Object.keys(productsByCategory).forEach((categoryId) => {
            const element = document.getElementById(`category-${categoryId}`)
            if (element) {
                observer.observe(element)
            }
        })

        return () => observer.disconnect()
    }, [])

    // Sticky detection
    useEffect(() => {
        const handleScroll = () => {
            if (stickyRef.current) {
                const rect = stickyRef.current.getBoundingClientRect()
                setIsSticky(rect.top <= 0)
            }
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleProductClick = (product: any) => {
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

    const getItemQuantity = (productId: number) => {
        return items.filter((item) => item.id === productId).reduce((sum, item) => sum + item.quantity, 0)
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
        <div className="min-h-screen bg-gray-50">
            {/* Category Navigation */}
            <div ref={stickyRef}>
                <ResponsiveCategoryNav
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                    isSticky={isSticky}
                />
            </div>

            {/* Layout Container */}
            <div className="lg:flex">
                {/* Desktop Sidebar Spacer */}
                {isSticky && <div className="hidden lg:block w-80 flex-shrink-0" />}

                {/* Mobile Sticky Spacer */}
                {isSticky && <div className="lg:hidden h-16 sm:h-20" />}

                {/* Main Content */}
                <div className="flex-1 w-full">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                        <div className="space-y-6 sm:space-y-8">
                            {Object.entries(productsByCategory).map(([categoryId, products]) => (
                                <ProductSection
                                    key={categoryId}
                                    categoryId={categoryId}
                                    categoryName={categoryNames[categoryId as keyof typeof categoryNames]}
                                    products={products}
                                    animatingCards={animatingCards}
                                    onProductClick={handleProductClick}
                                    onQuickAdd={handleQuickAdd}
                                    onQuickRemove={handleQuickRemove}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {selectedProduct && <ProductModal product={selectedProduct} onClose={handleCloseModal} />}
        </div>
    )
}
