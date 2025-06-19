import { Smartphone, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AppPromotion() {
  return (
    <div className="mt-8 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 rounded-2xl p-8 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between">
        <div className="flex-1 space-y-4">
          <h2 className="text-3xl lg:text-4xl font-bold">Download FoodHub App for</h2>
          <p className="text-2xl lg:text-3xl font-bold">
            The <span className="bg-white text-orange-500 px-3 py-1 rounded-lg">Best</span> Offers
          </p>
          <p className="text-lg opacity-90">Get exclusive deals and faster ordering with our mobile app</p>
          <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg font-semibold rounded-xl">
            <Download className="mr-2 h-5 w-5" />
            Download Now
          </Button>
        </div>

        <div className="flex-shrink-0 mt-6 lg:mt-0 lg:ml-8">
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="grid grid-cols-8 gap-1">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className={`w-1 h-1 ${Math.random() > 0.5 ? "bg-black" : "bg-white"}`}></div>
                ))}
              </div>
            </div>
            <p className="text-center text-gray-600 text-sm mt-2 font-medium">Scan QR Code</p>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 opacity-20">
        <Smartphone className="h-16 w-16" />
      </div>
    </div>
  )
}
