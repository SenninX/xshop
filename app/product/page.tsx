"use client"
import Image from "next/image";
import { Search, User, ShoppingBag, ShoppingCart, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Footer from "@/components/ui/footer";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";

function PaymentForm({
  selectedSize, setSelectedSize, quantity, setQuantity, address, setAddress, clientSecret, processing, setProcessing, error, setError, success, setSuccess
}: any) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  // 追加: レスポンシブ用のfontSize
  const [inputFontSize, setInputFontSize] = useState('12px');
  useEffect(() => {
    const handleResize = () => {
      setInputFontSize(window.innerWidth < 768 ? '12px' : '16px');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError("");

    // 新しいPaymentIntentを作成
    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 3500 * quantity }),
    });
    const data = await res.json();
    const clientSecret = data.clientSecret;

    // Stripe決済
    const cardNumberElement = elements.getElement(CardNumberElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumberElement!,
        billing_details: {
          name: `${address.lastName} ${address.firstName}`.trim(),
          phone: address.phone,
          email: address.email,
          address: {
            line1: address.address,
            country: address.country,
            postal_code: address.zip,
          },
        },
      },
    });
    setProcessing(false);
    if (result.error) {
      setError(result.error.message || "決済エラー");
    } else if (result.paymentIntent?.status === "succeeded") {
      // 決済成功時に注文情報をメール送信
      await fetch("/api/send-order-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lastName: address.lastName,
          firstName: address.firstName,
          email: address.email,
          size: selectedSize,
          quantity,
          zip: address.zip,
          address: address.address,
          address2: address.address2,
          phone: address.phone,
        }),
      });
      router.push("/thanks");
    }
  };

  if (success) return <div className="text-green-400 font-bold text-center">決済が完了しました！</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900/80 p-6 rounded-xl mt-2 w-full max-w-lg mx-auto">
      <div className="grid grid-cols-1 gap-4">
        <label className="block text-white text-sm font-medium">サイズ選択</label>
        <Select value={selectedSize} onValueChange={setSelectedSize} required>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-full">
            <SelectValue placeholder="サイズを選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="xs">XS</SelectItem>
            <SelectItem value="s">S</SelectItem>
            <SelectItem value="m">M</SelectItem>
            <SelectItem value="l">L</SelectItem>
            <SelectItem value="xl">XL</SelectItem>
            <SelectItem value="xxl">XXL</SelectItem>
          </SelectContent>
        </Select>
        <label className="block text-white text-sm font-medium">枚数</label>
        <Select value={quantity.toString()} onValueChange={v => setQuantity(Number(v))} required>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-full">
            <SelectValue placeholder="枚数を選択" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(10)].map((_, i) => (
              <SelectItem key={i+1} value={(i+1).toString()}>{i+1}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="grid grid-cols-2 gap-4">
          <input className="px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white" placeholder="姓" value={address.lastName} onChange={e => setAddress({ ...address, lastName: e.target.value })} required />
          <input className="px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white" placeholder="名" value={address.firstName} onChange={e => setAddress({ ...address, firstName: e.target.value })} required />
        </div>
        <input className="px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white" placeholder="メールアドレス" type="email" value={address.email || ""} onChange={e => setAddress({ ...address, email: e.target.value })} required />
        <input
          className="px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
          placeholder="郵便番号"
          value={address.zip}
          onChange={async (e) => {
            const zip = e.target.value;
            setAddress({ ...address, zip });
            if (zip.length === 7 && /^[0-9]+$/.test(zip)) {
              try {
                const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`);
                const data = await res.json();
                if (data.results && data.results[0]) {
                  const result = data.results[0];
                  setAddress({
                    ...address,
                    zip,
                    address: `${result.address1}${result.address2}${result.address3}`,
                  });
                }
              } catch (err) {
                // 住所取得失敗時は何もしない
              }
            }
          }}
          required
        />
        <input
          className="px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
          placeholder="住所"
          value={address.address}
          onChange={e => setAddress({ ...address, address: e.target.value })}
          required
        />
        <input
          className="px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
          placeholder="番地・建物名・部屋番号など"
          value={address.address2 || ''}
          onChange={e => setAddress({ ...address, address2: e.target.value })}
          required
        />
        <input className="px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white" placeholder="電話番号" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} required />
        <div className="flex flex-col gap-4">
          <label className="block text-white text-sm mb-0.5">カード番号</label>
          <CardNumberElement options={{ style: { base: { fontSize: inputFontSize, color: '#fff', backgroundColor: '#1e293b' } } }} className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-xs sm:text-sm mb-1">有効期限（月/年）</label>
              <CardExpiryElement options={{ style: { base: { fontSize: inputFontSize, color: '#fff', backgroundColor: '#1e293b' } } }} className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-white text-xs sm:text-sm mb-1">セキュリティ番号</label>
              <CardCvcElement options={{ style: { base: { fontSize: inputFontSize, color: '#fff', backgroundColor: '#1e293b' } }, placeholder: 'CVC' }} className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2" />
            </div>
          </div>
        </div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button type="submit" disabled={processing || !stripe || !elements || !selectedSize} className="bg-[#FFD814] hover:bg-[#F7CA00] text-black px-6 py-3 rounded font-semibold shadow transition-colors w-full max-w-xs mx-auto flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed">{processing ? "処理中..." : "支払う"}</button>
      </div>
    </form>
  );
}

export default function ProductPage() {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const router = useRouter();
  const [address, setAddress] = useState({ lastName: "", firstName: "", address: "", country: "JP", zip: "", phone: "" });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

  const handleAddToCart = () => {
    // 商品情報
    const item = {
      id: "X-NAM-Tshirt",
      name: "新アドバンスマインド2025限定Tシャツ",
      image: "/X-NAM-Tshirt.png",
      size: selectedSize,
      quantity,
      price: 3500,
    };
    // 既存カート取得
    const stored = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
    let cart = stored ? JSON.parse(stored) : [];
    // 同じ商品・サイズがあれば数量加算
    const idx = cart.findIndex((i:any) => i.id === item.id && i.size === item.size);
    if (idx > -1) {
      cart[idx].quantity += quantity;
    } else {
      cart.push(item);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    setShowMiniCart(true);
  };

  const handleCloseMiniCart = () => {
    setShowMiniCart(false);
  };

  const handleGoToCart = () => {
    setShowMiniCart(false);
    router.push("/cart");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Mini Cart Popup */}
      {showMiniCart && (
        <div className="fixed top-6 right-6 z-50 w-[350px] max-w-[90vw] bg-white rounded-xl shadow-2xl border border-gray-200 animate-fade-in flex flex-col">
          <div className="flex justify-between items-center px-5 pt-4 pb-2 border-b border-gray-100">
            <span className="text-gray-500 text-sm">カートに追加済み</span>
            <button onClick={handleCloseMiniCart} className="text-gray-400 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex gap-4 items-center px-5 py-4">
            <Image src="/X-NAM-Tshirt.png" alt="新アドバンスマインド2025限定Tシャツ" width={64} height={64} className="rounded bg-gray-100 object-cover" />
            <div className="flex-1">
              <div className="font-bold text-gray-900 leading-tight">新アドバンスマインド2025<br className='md:hidden'/>限定Tシャツ</div>
              <div className="text-xs text-gray-500 mt-1">サイズ: {selectedSize ? selectedSize.toUpperCase() : "-"}　数量: {quantity}</div>
            </div>
          </div>
          <div className="px-5 pb-4 flex flex-col gap-2">
            <Button className="w-full border border-gray-300 bg-white text-gray-900 font-bold py-2 hover:bg-gray-50" variant="outline" onClick={handleGoToCart}>
              カートを見る (1)
            </Button>
            <button className="w-full text-gray-600 text-sm underline hover:text-gray-900" onClick={handleCloseMiniCart}>買い物を続ける</button>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 lg:px-12 w-full">
        <div className="text-2xl font-bold text-white tracking-wider mb-2 md:mb-0">SenninX STORE</div>
        <nav className="flex items-center space-x-8 text-white">
          <a href="/" className="hover:text-blue-300 transition-colors">HOME</a>
          <a href="/contact" className="hover:text-blue-300 transition-colors">連絡先</a>
        </nav>
      </header>
      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-12 bg-gray-800/50 border border-gray-700 backdrop-blur-sm rounded-xl p-8 text-white">
        {/* 右：商品情報 */}
        <div className="flex-1 flex flex-col gap-6 justify-start items-center w-full max-w-full md:max-w-md mx-auto">
          <h1 className="text-base md:text-3xl font-bold text-center leading-tight">
            <span className="whitespace-nowrap text-base md:text-2xl">新アドバンスマインド2025</span><br />
            <span className="text-xl md:text-3xl">限定Ｔシャツ</span>
          </h1>
          <div className="flex-1 flex flex-col items-center">
            <Image src="/X-NAM-Tshirt.png" alt="新アドバンスマインド2025限定Tシャツ" width={400} height={400} className="rounded-xl bg-gray-900" />
          </div>
          <div className="text-gray-300 text-base text-center">
            <p>2025年限定デザインの高品質Tシャツ。<br />X-Familyロゴがフロントに大きくプリントされています。<br />普段使いにも、特別な日にもおすすめです。</p>
          </div>
          <Elements stripe={stripePromise}>
            <PaymentForm
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              quantity={quantity}
              setQuantity={setQuantity}
              address={address}
              setAddress={setAddress}
              clientSecret={clientSecret}
              processing={processing}
              setProcessing={setProcessing}
              error={error}
              setError={setError}
              success={success}
              setSuccess={setSuccess}
            />
          </Elements>
        </div>
      </div>
      <div className="mt-16" />
      <Footer />
    </div>
  );
} 