import { Star, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function Hero() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 flex flex-col lg:flex-row items-center p-8 lg:p-12">
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-bold">Delicious Food</h1>
            <p className="text-xl text-purple-100">Fast Food • American • Chicken</p>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">4.8</span>
              <span className="text-purple-200">(2.1k reviews)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>25-35 min</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
              Free Delivery
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
              Fast Delivery
            </Badge>
          </div>
        </div>

        <div className="flex-1 mt-8 lg:mt-0">
          <div className="relative">
            <img
              src="/placeholder.svg?height=300&width=400"
              alt="Delicious food spread"
              className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
