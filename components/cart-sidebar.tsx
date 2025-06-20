"use client"
import { X, Minus, Plus, ShoppingBag, Trash2, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { updateQuantity, removeItem, clearCart } from "@/store/cartSlice"
import Image from "next/image"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, totalItems, totalPrice } = useAppSelector((state) => state.cart)
  const dispatch = useAppDispatch()

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeItem(itemId))
    } else {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }))
    }
  }

  const handleRemoveItem = (itemId: number) => {
    dispatch(removeItem(itemId))
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  const formatCustomizations = (customizations: Record<string, string[]>) => {
    const formatted = []
    for (const [key, values] of Object.entries(customizations)) {
      if (values.length > 0) {
        formatted.push(values.join(", "))
      }
    }
    return formatted.join(" • ")
  }

  const deliveryFee = totalPrice > 50 ? 0 : 5
  const serviceFee = Math.round(totalPrice * 0.05 * 100) / 100
  const finalTotal = totalPrice + deliveryFee + serviceFee

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-orange-50 to-red-50">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-full">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
                <p className="text-sm text-gray-600">{totalItems} items</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-4">Add some delicious items to get started!</p>
                <Button onClick={onClose} className="bg-orange-500 hover:bg-orange-600">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex space-x-4">
                      {/* Item Image */}
                      <div className="flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          width={64}
                          height={64}
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>

                            {/* Customizations */}
                            {Object.keys(item.customizations).length > 0 && (
                              <div className="mt-1">
                                <p className="text-xs text-gray-600">{formatCustomizations(item.customizations)}</p>
                              </div>
                            )}

                            {/* Related Items */}
                            {item.relatedItems.length > 0 && (
                              <div className="mt-1">
                                <p className="text-xs text-blue-600">
                                  + {item.relatedItems.length} add-on{item.relatedItems.length > 1 ? "s" : ""}
                                </p>
                              </div>
                            )}

                            {/* Price */}
                            <div className="mt-2 flex items-center space-x-2">
                              <span className="font-bold text-green-600">₹{item.totalPrice.toFixed(0)}</span>
                              {item.totalPrice !== item.price && (
                                <span className="text-xs text-gray-500 line-through">₹{item.price.toFixed(0)}</span>
                              )}
                            </div>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center bg-gray-100 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 py-2 font-semibold text-sm min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-gray-900">₹{(item.totalPrice * item.quantity).toFixed(0)}</p>
                            <p className="text-xs text-gray-500">₹{item.totalPrice.toFixed(0)} each</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear Cart Button */}
                {items.length > 0 && (
                  <div className="pt-4">
                    <Button
                      variant="outline"
                      onClick={handleClearCart}
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Cart
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {items.length > 0 && (
            <div className="border-t bg-gray-50 p-6 space-y-4">
              {/* Delivery Info */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Delivery in 25-35 mins</span>
                <Star className="h-4 w-4 text-yellow-500" />
                <span>4.8 rating</span>
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">₹{totalPrice.toFixed(0)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Service fee</span>
                  <span className="font-medium">₹{serviceFee.toFixed(0)}</span>
                </div>

                <div className="flex justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-600">Delivery fee</span>
                    {deliveryFee === 0 && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        FREE
                      </Badge>
                    )}
                  </div>
                  <span className={`font-medium ${deliveryFee === 0 ? "text-green-600 line-through" : ""}`}>
                    ₹{deliveryFee.toFixed(0)}
                  </span>
                </div>

                {totalPrice < 50 && (
                  <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                    Add ₹{(50 - totalPrice).toFixed(0)} more for free delivery!
                  </div>
                )}
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-green-600">₹{finalTotal.toFixed(0)}</span>
              </div>

              {/* Checkout Button */}
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                Proceed to Checkout
              </Button>

              {/* Continue Shopping */}
              <Button variant="outline" onClick={onClose} className="w-full border-gray-300 hover:bg-gray-50">
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
