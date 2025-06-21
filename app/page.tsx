"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { ArrowLeft, Search, Star, Clock, Truck, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import LoadingSpinner from "@/components/loading-spinner"
import ProductGrid from "@/components/product-grid"
import { useAppSelector } from "@/store/hooks"
import CartSidebar from "@/components/cart-sidebar"

export default function FoodDeliveryApp() {
    const [scrollY, setScrollY] = useState(0)
    const [isSticky, setIsSticky] = useState(false)
    const [lastScrollY, setLastScrollY] = useState(0)
    const titleRef = useRef<HTMLDivElement>(null)
    const originalTitleRef = useRef<HTMLDivElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isCartOpen, setIsCartOpen] = useState(false)
    const { totalItems, totalPrice } = useAppSelector((state) => state.cart)


    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            setScrollY(currentScrollY)

            // Get the original title position
            if (originalTitleRef.current) {
                const titleRect = originalTitleRef.current.getBoundingClientRect()
                const titleTop = titleRect.top + currentScrollY

                // Trigger sticky when title would go out of view (scrolled past 200px)
                if (currentScrollY > 200 && !isSticky) {
                    setIsSticky(true)
                } else if (currentScrollY <= 200 && isSticky) {
                    setIsSticky(false)
                }
            }

            setLastScrollY(currentScrollY)
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [isSticky])

    // Calculate animation progress for smooth transition
    const animationProgress = Math.min(Math.max((scrollY - 150) / 100, 0), 1)

    return (
        <div className="min-h-[200vh] bg-gray-50 mx-3 md:mx-20 relative">
            {/* Sticky Header Container */}
            <div
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${isSticky
                    ? "translate-y-0 opacity-100 backdrop-blur-md bg-white/90 shadow-lg border-b border-gray-200"
                    : "-translate-y-full opacity-0"
                    }`}
            >
                <div className="mx-3 md:mx-20 px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 animate-slide-in">Bk Boutique</h2>
                    </div>

                    <div className="space-x-3 flex items-center">
                        <Button variant="ghost" size="icon" className="rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200">
                            <Search className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="relative hover:bg-orange-50 transition-colors"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {totalItems > 0 && (
                                <>
                                    <Badge className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white text-xs h-5 w-5 flex items-center justify-center p-0 rounded-full animate-bounce">
                                        {totalItems}
                                    </Badge>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Original Header */}
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 px-4 py-6 text-white">
                <div className="flex items-center justify-between mb-6">
                    <Button variant="ghost" size="icon" className="rounded-full bg-white text-gray-800 hover:bg-gray-100">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full bg-white text-gray-800 hover:bg-gray-100">
                        <Search className="h-5 w-5" />
                    </Button>
                </div>

                {/* Welcome Text */}
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-pink-300 mb-2" style={{ fontFamily: "cursive" }}>
                        Welcome To
                    </h1>
                </div>
            </div>

            {/* Restaurant Info Card */}
            <div className="mx-4 md:mx-24 -mt-8 relative z-10">
                <Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                        {/* Restaurant Header with Original Title */}
                        <div className="flex items-start gap-4 mb-6" ref={originalTitleRef}>
                            <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">BK</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2
                                            className={`text-2xl font-bold transition-all duration-500 ${isSticky ? "text-gray-400 scale-95" : "text-gray-900 scale-100"
                                                }`}
                                        >
                                            Bk Boutique
                                        </h2>
                                        <p className="text-gray-600">Desserts, Bakery</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-semibold">4.2</span>
                                        <span className="text-gray-600">(509)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Options */}
                        <div className="flex gap-2 mb-6">
                            <Button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full py-3">
                                <Truck className="h-4 w-4 mr-2" />
                                Delivery
                            </Button>
                            <Button variant="outline" className="flex-1 relative rounded-full py-3">
                                Pick-up
                                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1">20% Off</Badge>
                            </Button>
                        </div>

                        {/* Order Details */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center">
                                <p className="text-gray-600 md:text-sm text-xs">Min. Order</p>
                                <p className="font-semibold text-sm">₹15</p>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-600 md:text-sm text-xs">Delivery Time</p>
                                <div className="flex items-center justify-center gap-1">
                                    <Clock className="h-4 w-4 text-green-500" />
                                    <p className="font-semibold text-xs">35 - 50 minutes</p>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-600 md:text-sm text-xs">Delivery Fee</p>
                                <p className="font-semibold text-sm">₹40</p>
                            </div>
                        </div>

                        {/* Promotional Banner */}
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
                            <p className="text-orange-600 font-semibold text-center">🚚 1 Year Free Delivery + SR150 Coupons</p>
                        </div>

                        {/* Discount Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 md:gap-3 gap-2 mb-6">
                            {[1, 2, 3, 4].map((i) => (
                                <Card key={i} className="bg-orange-50 border-orange-200">
                                    <CardContent className="p-4 text-center">
                                        <p className="text-orange-600 font-bold text-lg">₹10 Off</p>
                                        <p className="text-orange-600 text-sm">on Whole Menu</p>
                                        <p className="text-gray-600 text-xs mt-2">Min. Spend ₹40</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Navigation Tabs */}
            <div className="flex flex-col lg:flex-row gap-8 mt-8">
                <section className="flex-1">
                    <Suspense fallback={<LoadingSpinner />}>
                        <ProductGrid />
                    </Suspense>
                </section>
            </div>
            {/* Bottom Spacing */}
            <div className="h-20"></div>
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />



            <style jsx>{`
        @keyframes slide-in {
          from { 
            opacity: 0; 
            transform: translateX(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out 0.2s both;
        }
      `}</style>
        </div>
    )
}
