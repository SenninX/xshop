"use client"
import React, { useState } from "react";
import Footer from "@/components/ui/footer";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        alert("送信が完了しました。ありがとうございました。");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        alert("送信に失敗しました。時間をおいて再度お試しください。");
      }
    } catch (err) {
      alert("送信中にエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

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
        <div className="bg-gray-800/70 rounded-xl p-10 max-w-2xl w-full text-center shadow-lg flex flex-col items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 whitespace-nowrap">お問い合わせ</h1>
          <p className="text-lg text-gray-200 mb-10">
            配送、注文、返品交換など、SenninX STOREの商品に関してのお問い合わせはこちらへご連絡ください。一括購入をご希望の法人様もお気軽にお問い合わせください。
          </p>
          <form className="space-y-6 w-full" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-gray-200 mb-1 text-left">名前</label>
                <input id="name" name="name" type="text" autoComplete="name" className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-900 text-white" value={form.name} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-200 mb-1 text-left">Eメール<span className="text-red-500"> *</span></label>
                <input id="email" name="email" type="email" autoComplete="email" required className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-900 text-white" value={form.email} onChange={handleChange} />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-200 mb-1 text-left">メッセージ</label>
              <textarea id="message" name="message" rows={5} className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-900 text-white" value={form.message} onChange={handleChange} />
            </div>
            <div className="flex justify-center">
              <button type="submit" className="bg-[#FFD814] hover:bg-[#F7CA00] text-black px-8 py-3 rounded font-semibold shadow transition-colors" disabled={loading}>
                {loading ? "送信中..." : "送信"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
} 