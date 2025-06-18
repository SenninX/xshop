"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Footer from "@/components/ui/footer";
import { User, ShoppingBag } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // localStorageからカート情報を取得
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  const handleRemove = (id: string, size: string) => {
    const newCart = cart.filter((item) => !(item.id === id && item.size === size));
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleQuantityChange = (id: string, size: string, qty: number) => {
    const newCart = cart.map((item) =>
      item.id === id && item.size === size ? { ...item, quantity: qty } : item
    );
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <header className="relative z-10 flex items-center justify-between p-6 lg:px-12 w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="text-2xl font-bold text-white tracking-wider">SenninX STORE</div>
        <nav className="hidden md:flex items-center space-x-8 text-white absolute left-1/2 -translate-x-1/2">
          <a href="/" className="hover:text-blue-300 transition-colors">HOME</a>
          <a href="/contact" className="hover:text-blue-300 transition-colors">連絡先</a>
        </nav>
      </header>
      <main className="flex-1 max-w-4xl mx-auto w-full px-2 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">ショッピングカート</h1>
        <div className="text-center mb-8">
          <a href="/" className="text-blue-300 underline hover:text-white">買い物を続ける</a>
        </div>
        {cart.length === 0 ? (
          <div className="text-center text-gray-400 py-24">カートに商品がありません。</div>
        ) : (
          <div className="bg-gray-900/80 rounded-xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-gray-300 text-sm border-b border-gray-700">
                    <th className="font-normal">商品名</th>
                    <th className="font-normal">価格</th>
                    <th className="font-normal">数量</th>
                    <th className="font-normal">合計</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id + item.size} className="align-top bg-gray-800/80 text-white">
                      <td className="py-2 flex gap-4 items-center min-w-[220px]">
                        <Image src={item.image} alt={item.name} width={64} height={64} className="rounded bg-white object-contain" />
                        <div>
                          <div className="font-bold leading-tight">{item.name}</div>
                          <div className="text-xs text-gray-300 mt-1">サイズ: {item.size ? item.size.toUpperCase() : "-"}</div>
                          <button className="text-xs text-gray-400 underline mt-1 hover:text-red-400" onClick={() => handleRemove(item.id, item.size)}>削除</button>
                        </div>
                      </td>
                      <td className="py-2 align-middle">¥{item.price.toLocaleString()}</td>
                      <td className="py-2 align-middle">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={e => handleQuantityChange(item.id, item.size, Number(e.target.value))}
                          className="w-16 border border-gray-600 rounded px-2 py-1 text-center bg-gray-900 text-white"
                        />
                      </td>
                      <td className="py-2 align-middle">¥{(item.price * item.quantity).toLocaleString()}</td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col items-end mt-8">
              <div className="text-lg mb-2 text-white">小計 <span className="font-bold">¥{subtotal.toLocaleString()} JPY</span></div>
              <div className="text-xs text-gray-300 mb-4">税込価格。配送料は購入手続き時に計算されます。</div>
              <button className="bg-white text-black px-6 py-3 rounded font-semibold mb-4 hover:bg-gray-100">ご購入手続きへ</button>
              <div className="flex gap-4">
                <button className="bg-[#5a31f4] text-white px-6 py-2 rounded font-bold">shop<span className="ml-1">Pay</span></button>
                <button className="bg-[#ffc439] text-black px-6 py-2 rounded font-bold">PayPal</button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 