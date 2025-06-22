"use client"

import { useState } from "react"
import Image from "next/image"
import { Play, Star, ShoppingCart, Heart, Menu, User, ShoppingBag, TrendingUp, Handshake, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Footer from "@/components/ui/footer"

export default function StarlinkTshirtStore() {
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch("/api/convertkit-subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitStatus("success")
        setEmail("")
      } else {
        setSubmitStatus("error")
        setErrorMessage(data.error?.message || "登録に失敗しました。")
      }
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage("通信エラーが発生しました。")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 lg:px-12">
        <div className="text-2xl font-bold text-white tracking-wider">SenninX STORE</div>
        <nav className="hidden md:flex items-center space-x-8 text-white absolute left-1/2 -translate-x-1/2">
          <a href="/" className="hover:text-blue-300 transition-colors">
            HOME
          </a>
          <a href="/contact" className="hover:text-blue-300 transition-colors">
            連絡先
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-12 py-12 sm:py-20 text-center">
        {/* Stars background effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full opacity-60"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-white rounded-full opacity-80"></div>
          <div className="absolute top-60 left-1/3 w-1 h-1 bg-white rounded-full opacity-40"></div>
          <div className="absolute bottom-40 right-20 w-1 h-1 bg-white rounded-full opacity-70"></div>
          <div className="absolute top-32 right-1/4 w-1 h-1 bg-white rounded-full opacity-50"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            SenninX<br />PREMIUM COLLECTION
          </h1>
          <div className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            <p>Wear the future with our exclusive designs</p>
            <p>
              See <span className="text-white font-semibold">styles</span> in your wardrobe
            </p>
          </div>
        </div>

        {/* Satellite dish illustration placeholder */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-20">
          <div className="w-64 h-64 border-4 border-white rounded-full"></div>
        </div>
      </section>

      {/* Product Cards */}
      <section className="px-6 lg:px-12 pb-20">
        <div className="max-w-6xl mx-auto flex justify-center items-center gap-8">
          {/* Classic Tee Card */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm max-w-md w-full">
            <CardHeader className="text-white">
              <CardTitle className="text-2xl font-bold text-center w-full max-w-md mx-auto">新アドバンスマインド2025<br />限定Tシャツ</CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <div className="mb-6 flex justify-center items-center w-full aspect-square bg-white rounded-lg">
                <Image
                  src="/X-NAM-Tshirt.png"
                  alt="新アドバンスマインド2025限定Tシャツ"
                  width={300}
                  height={300}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-300">(73 reviews)</span>
              </div>
              <div className="flex gap-3">
                <Button className="bg-[#FFD814] hover:bg-[#F7CA00] text-black flex-1" asChild>
                  <a href="/product">詳しくはこちら</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Product Detail Section */}
      <section className="bg-black py-20 relative overflow-hidden">
        {/* Topographic lines background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            <path d="M0,400 Q300,200 600,400 T1200,400" stroke="white" strokeWidth="2" fill="none" />
            <path d="M0,450 Q300,250 600,450 T1200,450" stroke="white" strokeWidth="1" fill="none" />
            <path d="M0,350 Q300,150 600,350 T1200,350" stroke="white" strokeWidth="1" fill="none" />
            <path d="M0,500 Q300,300 600,500 T1200,500" stroke="white" strokeWidth="1" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 leading-snug break-words">
            <span className="block sm:hidden">
              仙人さんからの<br />特別なお知らせを受け取る
            </span>
            <span className="hidden sm:inline">
              仙人さんからの特別なお知らせを受け取る
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-300 mb-12">
            <span className="block sm:hidden">
              メールアドレスを登録すると、<br />
              最新情報や限定オファーをお届けします。
            </span>
            <span className="hidden sm:inline">
              メールアドレスを登録すると、最新情報や限定オファーをお届けします。
            </span>
          </p>
          <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-4 items-center justify-center">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレスを入力"
              className="flex-1 px-4 py-3 rounded-md bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-3 rounded-md transition-colors shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "登録中..." : "登録する"}
            </button>
          </form>
          
          {/* Status Messages */}
          {submitStatus === "success" && (
            <div className="mt-4 p-3 bg-green-600/20 border border-green-500 rounded-md">
              <p className="text-green-400">メール登録が完了しました！</p>
            </div>
          )}
          
          {submitStatus === "error" && (
            <div className="mt-4 p-3 bg-red-600/20 border border-red-500 rounded-md">
              <p className="text-red-400">{errorMessage}</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-10 sm:py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Evolution</h3>
              <p className="text-gray-300">Grow beyond limits.</p>
            </div>
            <div className="text-white">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Contribution</h3>
              <p className="text-gray-300">Give more, become more.</p>
            </div>
            <div className="text-white">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Reproduction</h3>
              <p className="text-gray-300">Pass on the spark of life.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer Section */}
      <Footer />
    </div>
  )
}
