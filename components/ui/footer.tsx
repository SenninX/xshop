import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#25386b] to-[#2b4682] py-8 mt-0">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 text-gray-200 mb-6 text-sm">
          <a href="https://xcapitalism.com/privacy/" target="_blank" rel="noopener noreferrer" className="hover:underline">プライバシーポリシー</a>
          <a href="https://xcapitalism.com/tokusho/" target="_blank" rel="noopener noreferrer" className="hover:underline">特定商取引法に基づく表記</a>
        </div>
        <div className="flex justify-center gap-4 flex-wrap mb-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" className="h-7" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-7" />
        </div>
        <div className="text-center text-gray-200 text-sm">© 2025, SenninX STORE</div>
      </div>
    </footer>
  );
} 