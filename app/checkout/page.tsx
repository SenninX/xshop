"use client"
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CheckoutPage() {
  // 仮データ
  const [selectedAddress, setSelectedAddress] = useState("1");
  const addresses = [
    {
      id: "1",
      label: "Youngbeom CHOI, 50 Al Rigga Rd,Deira #710 Al Sarab Hotel Dubai, DU, AE",
      default: true,
    },
    {
      id: "2",
      label: "Youngbeom CHOI, 那加吾妻町 2, 各務原市, 岐阜県, 504-0962, 日本",
      default: false,
    },
  ];
  const cart = [
    { id: "1", name: "英単語帳 Distinction 4", price: 3500, qty: 1, image: "/distinction4.png" },
    { id: "2", name: "発音マスタークラス | Pronunciation Masterclass【動画講座】", price: 10960, qty: 2, image: "/masterclass.png" },
  ];
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <header className="w-full max-w-5xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-center text-white mb-2">ご購入手続き</h1>
      </header>
      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-12 bg-gray-800/50 border border-gray-700 backdrop-blur-sm rounded-xl p-8 text-white">
        {/* 左：配送先・支払い */}
        <div className="flex-1 min-w-[320px]">
          <h2 className="text-xl font-bold mb-4">配送先</h2>
          <div className="space-y-4 mb-8">
            {addresses.map(addr => (
              <label key={addr.id} className={`block p-4 rounded border cursor-pointer ${selectedAddress === addr.id ? 'border-blue-400 bg-gray-900/80' : 'border-gray-600 bg-gray-900/40'}`}>
                <input
                  type="radio"
                  name="address"
                  value={addr.id}
                  checked={selectedAddress === addr.id}
                  onChange={() => setSelectedAddress(addr.id)}
                  className="mr-2 accent-blue-500"
                />
                {addr.label}
                {addr.default && <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded">デフォルト</span>}
              </label>
            ))}
            <Button className="bg-gray-900 text-white w-full">異なる住所を使用する</Button>
          </div>
          <h2 className="text-xl font-bold mb-4 mt-8">お支払い</h2>
          <div className="mb-4">
            <input type="text" placeholder="カードの名義人" className="w-full mb-2 px-3 py-2 rounded bg-gray-900 border border-gray-600 text-white" />
            <input type="text" placeholder="カード番号" className="w-full mb-2 px-3 py-2 rounded bg-gray-900 border border-gray-600 text-white" />
            <div className="flex gap-2">
              <input type="text" placeholder="MM/YY" className="flex-1 px-3 py-2 rounded bg-gray-900 border border-gray-600 text-white" />
              <input type="text" placeholder="CVC" className="flex-1 px-3 py-2 rounded bg-gray-900 border border-gray-600 text-white" />
            </div>
          </div>
          <div className="flex items-center mb-4">
            <input type="checkbox" id="sameAsBilling" className="mr-2 accent-blue-500" defaultChecked />
            <label htmlFor="sameAsBilling" className="text-gray-200 text-sm">お届け先住所を請求先住所として使用する</label>
          </div>
          <Button className="w-full bg-purple-400 text-white font-bold text-lg py-4 mb-4">今すぐ支払う</Button>
          <Button variant="outline" className="w-full text-blue-400 border-blue-400">ゲストとして購入する</Button>
        </div>
        {/* 右：カート内容 */}
        <div className="flex-1 min-w-[320px] md:max-w-md">
          <h2 className="text-xl font-bold mb-4">ご注文内容</h2>
          <div className="bg-gray-900/80 rounded-lg p-4 mb-4">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-4 mb-4 last:mb-0">
                <div className="w-16 h-16 bg-white rounded overflow-hidden flex items-center justify-center">
                  <img src={item.image} alt={item.name} className="object-contain w-full h-full" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white text-sm mb-1">{item.name}</div>
                  <div className="text-gray-400 text-xs">数量: {item.qty}</div>
                </div>
                <div className="font-bold text-white">¥{item.price.toLocaleString()}</div>
              </div>
            ))}
            <div className="flex justify-between items-center border-t border-gray-700 pt-4 mt-4">
              <div className="text-lg font-bold text-white">合計</div>
              <div className="text-2xl font-bold text-purple-300">¥{subtotal.toLocaleString()}</div>
            </div>
          </div>
          <div className="text-xs text-gray-400 mb-2">※送料はお届け先入力後に計算されます</div>
          <input type="text" placeholder="クーポンコード" className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-600 text-white mb-2" />
          <Button className="w-full bg-gray-700 text-white">適用</Button>
        </div>
      </div>
      <div className="mt-16" />
      <Footer />
    </div>
  );
} 