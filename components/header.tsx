"use client"

import { useState } from "react"
import { Search, ShoppingCart, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/store/hooks"
import CartSidebar from "./cart-sidebar"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { totalItems, totalPrice } = useAppSelector((state) => state.cart)

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-lg font-bold text-xl">
                FoodHub
              </div>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for restaurants, dishes..."
                  className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <Button variant="outline" size="sm" className="hidden sm:flex">
                English
              </Button>

              {/* Enhanced Cart Button */}
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
                    {/* Price indicator for larger screens */}
                    <div className="hidden sm:block absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                      ₹{totalPrice.toFixed(0)}
                    </div>
                  </>
                )}
              </Button>

              {/* User */}
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
              </Button>

              {/* Mobile menu toggle */}
              <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t py-4">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search for restaurants, dishes..."
                    className="pl-10 pr-4 py-2 w-full"
                  />
                </div>
                <Button variant="outline" className="w-full justify-start">
                  English
                </Button>
                {/* Mobile Cart Summary */}
                {totalItems > 0 && (
                  <Button
                    onClick={() => {
                      setIsCartOpen(true)
                      setIsMenuOpen(false)
                    }}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    View Cart ({totalItems} items) - ₹{totalPrice.toFixed(0)}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
