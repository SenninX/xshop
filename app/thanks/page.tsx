"use client";
import Footer from "@/components/ui/footer";
import { User, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ThanksPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col">
      <header className="relative z-10 flex items-center justify-between p-6 lg:px-12">
        <div className="text-2xl font-bold text-white tracking-wider">SenninX STORE</div>
        <nav className="hidden md:flex items-center space-x-8 text-white absolute left-1/2 -translate-x-1/2">
          <a href="/" className="hover:text-blue-300 transition-colors">HOME</a>
          <a href="/contact" className="hover:text-blue-300 transition-colors">連絡先</a>
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="bg-gray-800/70 rounded-xl p-10 max-w-xl w-full text-center shadow-lg flex flex-col items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 whitespace-nowrap">ご購入ありがとうございました！</h1>
          <p className="text-lg text-gray-200 mb-10">ご注文・お支払いが正常に完了しました。<br />ご登録のメールアドレスに確認メールをお送りしています。</p>
          <a href="/" className="bg-[#FFD814] hover:bg-[#F7CA00] text-black px-8 py-3 rounded font-semibold shadow transition-colors">トップページへ戻る</a>
        </div>
      </main>
      <Footer />
    </div>
  );
} 