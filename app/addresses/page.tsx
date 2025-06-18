"use client"
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AddressesPage() {
  const router = useRouter();
  // 仮データ
  const address = {
    name: "junghee chung",
    zip: "504-0962",
    address: "岐阜県 kakamigahara naka azuma cho 2",
    country: "日本",
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <header className="w-full max-w-2xl mx-auto mb-10">
        <h1 className="text-4xl font-bold text-center text-white mb-2">あなたの住所</h1>
        <div className="text-center mb-8">
          <a href="/account" className="text-gray-400 underline hover:text-white">アカウントの詳細に戻る</a>
        </div>
        <div className="flex flex-col items-center gap-4">
          <Button className="bg-gray-900 text-white w-full max-w-xs">新しい住所を追加する</Button>
        </div>
      </header>
      <div className="max-w-2xl w-full mx-auto bg-gray-800/50 border border-gray-700 backdrop-blur-sm rounded-xl p-8 text-white flex flex-col items-center">
        <div className="text-center mb-6">
          <div className="text-lg font-bold mb-2">標準設定</div>
          <div className="text-gray-200 mb-2">
            <div>{address.name}</div>
            <div>{address.zip}</div>
            <div>{address.address}</div>
            <div>{address.country}</div>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <Button className="bg-gray-900 text-white">編集</Button>
          <Button className="bg-gray-900 text-white">削除</Button>
        </div>
      </div>
      <div className="mt-16" />
      <Footer />
    </div>
  );
} 