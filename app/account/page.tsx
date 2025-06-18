"use client"
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  // 仮データ
  const orders = [
    {
      id: "76522",
      date: "2025年2月22日",
      payment: "支払い済",
      shipping: "発送済",
      total: "¥5,480",
    },
  ];
  const user = {
    name: "junghee chung",
    zip: "504-0962",
    address: "岐阜県 kakamigahara naka azuma cho 2",
    country: "日本",
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <header className="w-full max-w-5xl mx-auto mb-10">
        <h1 className="text-4xl font-bold text-center text-white mb-2">私のアカウント</h1>
        <div className="text-center mb-8">
          <button className="text-gray-400 underline hover:text-white">ログアウト</button>
        </div>
      </header>
      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-12 bg-gray-800/50 border border-gray-700 backdrop-blur-sm rounded-xl p-8 text-white">
        {/* 左：注文履歴 */}
        <div className="flex-1 min-w-[300px]">
          <h2 className="text-xl font-bold mb-4">注文履歴</h2>
          <Button className="bg-gray-900 text-white mb-4">購入済みコース一覧</Button>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2 bg-transparent">
              <thead>
                <tr className="text-gray-300 text-sm">
                  <th className="font-normal">注文</th>
                  <th className="font-normal">日付</th>
                  <th className="font-normal">お支払い状況</th>
                  <th className="font-normal">配送状況</th>
                  <th className="font-normal">合計</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="bg-gray-900/80 text-white rounded">
                    <td className="py-2 px-2">
                      <span className="border border-gray-400 rounded px-2 py-1 text-xs bg-white text-black font-mono">#{order.id}</span>
                    </td>
                    <td className="py-2 px-2">{order.date}</td>
                    <td className="py-2 px-2">{order.payment}</td>
                    <td className="py-2 px-2">{order.shipping}</td>
                    <td className="py-2 px-2">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* 右：アカウント詳細 */}
        <div className="flex-1 min-w-[260px] md:max-w-xs">
          <h2 className="text-xl font-bold mb-4">アカウントの詳細</h2>
          <div className="mb-4 text-gray-200">
            <div>{user.name}</div>
            <div>{user.zip}</div>
            <div>{user.address}</div>
            <div>{user.country}</div>
          </div>
          <Button className="bg-gray-900 text-white" onClick={() => router.push("/addresses")}>住所を確認する（1）</Button>
        </div>
      </div>
      <div className="mt-16" />
      <Footer />
    </div>
  );
} 