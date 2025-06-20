import { Suspense } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import CategorySidebar from "@/components/category-sidebar"
import ProductGrid from "@/components/product-grid"
import AppPromotion from "@/components/app-promotion"
import LoadingSpinner from "@/components/loading-spinner"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Hero />
        <AppPromotion />
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <section className="flex-1">
            <Suspense fallback={<LoadingSpinner />}>
              <ProductGrid />
            </Suspense>
          </section>
        </div>
      </main>
    </div>
  )
}
