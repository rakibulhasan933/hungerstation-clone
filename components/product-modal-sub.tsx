"use client"

import React, { useState } from "react"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
} from "@/components/ui/drawer"
import useMediaQuery from "@/hooks/use-media-query"
import ScrollableContent from "./scrollable-content"
import { CheckCircle2 } from "lucide-react"

interface ProductModalProps {
    product: any
    onClose: () => void
}




export default function productModalSub({ product, onClose }: ProductModalProps) {
    const [open, setOpen] = React.useState(false)
    const [isMobile, setIsMobile] = React.useState(false);
    const [quantity, setQuantity] = React.useState(1)
    const [showSuccess, setShowSuccess] = useState(false)
    const [isOpen, setIsOpen] = useState(true)



    const isDesktop = useMediaQuery("(min-width: 768px)");




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

    if (showSuccess) {
        return <SuccessState />
    }


    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener("resize", checkMobile)

        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    const handleClose = React.useCallback(() => {
        setOpen(false)
    }, [])

    // Desktop Dialog
    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden">
                    <DialogTitle className="hidden">Hello</DialogTitle>
                    <ScrollableContent product={product} onClose={handleClose} />
                </DialogContent>
            </Dialog>
        )
    }

    // Mobile Drawer
    return (
        <Drawer open={isOpen} onOpenChange={handleOpenChange}>
            <DrawerContent className="h-[95vh] min-w-full">
                <ScrollableContent product={product} onClose={handleClose} />
            </DrawerContent>
        </Drawer>
    )
}
