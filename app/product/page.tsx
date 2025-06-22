"use client"
import Image from "next/image";
import { Search, User, ShoppingBag, ShoppingCart, X, Loader2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Footer from "@/components/ui/footer";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";

interface Address {
  lastName: string;
  firstName: string;
  email: string;
  address: string;
  address2: string;
  country: string;
  zip: string;
  phone: string;
}

function PaymentForm({
  selectedOption,
  selectedSize,
  setSelectedSize,
  address,
  setAddress,
  clientSecret,
  processing,
  setProcessing,
  error,
  setError,
  success,
  setSuccess,
}: {
  selectedOption: string;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  address: Address;
  setAddress: (address: Address | ((prev: Address) => Address)) => void;
  clientSecret: string | null;
  processing: boolean;
  setProcessing: (processing: boolean) => void;
  error: string;
  setError: (error: string) => void;
  success: boolean;
  setSuccess: (success: boolean) => void;
}) {
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

  const amount = useMemo(() => {
    if (selectedOption === "vip") return 4700;
    if (selectedOption === "normal") return 1700;
    if (selectedOption === "tshirt") return 1470;
    return 0;
  }, [selectedOption]);

  const shippingFee = 500;
  const totalAmount = amount + shippingFee;

  // プラン名を選択肢に応じて表示
  const planName = selectedOption === "vip" ? "VIPファミリー" : selectedOption === "normal" ? "Normalメンバー" : "Ｔシャツオンリー";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError("");

    // 新しいPaymentIntentを作成
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '決済サーバーとの通信に失敗しました。');
      }

      const data = await res.json();
      const clientSecret = data.clientSecret;
  
      if (!clientSecret) {
        throw new Error('clientSecretの取得に失敗しました。');
      }

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
      
      if (result.error) {
        // カード情報の間違いなど、即時エラーの処理
        setError(result.error.message || "決済エラーが発生しました。入力内容をご確認ください。");
        setProcessing(false);
      } else {
        // 即時エラーがない場合、決済ステータスを確認
        if (result.paymentIntent.status === 'succeeded') {
          // これが成功ルート
          try {
            // メール送信とスプレッドシート書き込みを実行
            const mailResponse = await fetch("/api/send-order-mail", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                lastName: address.lastName, firstName: address.firstName, email: address.email,
                size: selectedSize, quantity: 1, zip: address.zip, address: address.address,
                address2: address.address2, phone: address.phone, selectedOption: selectedOption,
                totalAmount: totalAmount,
              }),
            });

            if (!mailResponse.ok) {
              const errorData = await mailResponse.json();
              throw new Error(errorData.error || '購入完了メールの送信に失敗しました。');
            }
            
            const sheetResponse = await fetch("/api/add-to-spreadsheet", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                lastName: address.lastName, firstName: address.firstName, email: address.email,
                size: selectedSize, selectedOption: selectedOption, zip: address.zip,
                address: address.address, address2: address.address2, phone: address.phone,
                totalAmount: totalAmount,
              }),
            });

            if (!sheetResponse.ok) {
              const errorData = await sheetResponse.json();
              throw new Error(errorData.error || 'スプレッドシートへの記録に失敗しました。');
            }
            
            router.push("/thanks");

          } catch (err: any) {
            // 決済後の処理でエラーが発生した場合
            setError(`決済後の処理でエラーが発生しました。管理者にお問い合わせください。詳細: ${err.message}`);
            setProcessing(false);
          }
        } else {
          // 3Dセキュアなど、追加のアクションが必要な場合や、その他のステータス
          setError(`決済を完了できませんでした。ステータス: ${result.paymentIntent.status}`);
          setProcessing(false);
        }
      }
    } catch (err: any) {
      setError(err.message);
      setProcessing(false);
    }
  };

  if (success) return <div className="text-green-400 font-bold text-center">決済が完了しました！</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900/80 p-6 rounded-xl w-full max-w-lg mx-auto">
      <div className="grid grid-cols-1 gap-4">
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
            const rawZip = e.target.value;
            // 入力値を即座にstateに反映
            setAddress(prev => ({ ...prev, zip: rawZip }));

            // API呼び出しのためにハイフンを除去
            const zipForApi = rawZip.replace(/-/g, '');

            if (zipForApi.length === 7 && /^[0-9]+$/.test(zipForApi)) {
              try {
                const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipForApi}`);
                const data = await res.json();
                if (data.results && data.results[0]) {
                  const result = data.results[0];
                  // 住所をstateに反映
                  setAddress(prev => ({
                    ...prev,
                    address: `${result.address1}${result.address2}${result.address3}`,
                  }));
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
          className="px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white text-sm md:text-base"
          placeholder="番地・建物名・部屋番号など"
          value={address.address2 || ''}
          onChange={e => setAddress({ ...address, address2: e.target.value })}
          required
        />
        <input className="px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white" placeholder="電話番号" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} required />
        <div className="flex flex-col gap-4">
          <CardNumberElement 
            options={{ 
              style: { base: { fontSize: inputFontSize, color: '#fff', backgroundColor: '#1e293b' } }, 
              placeholder: 'カード番号（例: 4242 4242 4242 4242）' 
            }} 
            className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2" 
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <CardExpiryElement options={{ style: { base: { fontSize: inputFontSize, color: '#fff', backgroundColor: '#1e293b' } } }} className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2" />
            </div>
            <div>
              <CardCvcElement options={{ style: { base: { fontSize: inputFontSize, color: '#fff', backgroundColor: '#1e293b' } }, placeholder: 'セキュリティコード' }} className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2" />
            </div>
          </div>
        </div>
        <div className="text-center my-4">
          <span className="text-lg text-gray-300">{planName}：{amount.toLocaleString()}円{selectedOption === "tshirt" ? "" : "/月"}</span>
          <div className="text-xs text-gray-300 mt-2">配送サポート、事務手数料: 500円</div>
          <div className="text-2xl md:text-3xl font-extrabold text-white mt-2">合計: {totalAmount.toLocaleString()}円{selectedOption === "tshirt" ? "" : "/月"}</div>
        </div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button type="submit" disabled={processing || !stripe || !elements || !selectedSize} className="bg-[#FFD814] hover:bg-[#F7CA00] text-black px-6 py-3 rounded font-semibold shadow transition-colors w-full max-w-xs mx-auto flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>処理中...</span>
            </>
          ) : (
            "支払う"
          )}
        </button>
        <div className="text-center mt-4">
          <div className="flex justify-center items-center gap-4 mb-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" className="h-6 bg-white p-1 rounded" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6" />
          </div>
          <p className="text-xs text-gray-400">AMEXとJCBは対応していません</p>
        </div>
      </div>
    </form>
  );
}

export default function ProductPage() {
  const [selectedOption, setSelectedOption] = useState("vip");
  const [selectedSize, setSelectedSize] = useState("");
  const [showMiniCart, setShowMiniCart] = useState(false);
  const router = useRouter();
  const [address, setAddress] = useState<Address>({ lastName: "", firstName: "", email: "", address: "", address2: "", country: "JP", zip: "", phone: "" });
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
      quantity: 1,
      price: 3500,
    };
    // 既存カート取得
    const stored = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
    let cart = stored ? JSON.parse(stored) : [];
    // 同じ商品・サイズがあれば数量加算
    const idx = cart.findIndex((i:any) => i.id === item.id && i.size === item.size);
    if (idx > -1) {
      cart[idx].quantity += 1;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
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
              <div className="text-xs text-gray-500 mt-1">サイズ: {selectedSize ? selectedSize.toUpperCase() : "-"}　数量: 1</div>
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
      <header className="relative z-10 flex items-center justify-between p-6 lg:px-12 w-full">
        <div className="text-xl sm:text-2xl font-bold text-white tracking-wider whitespace-nowrap">SenninX STORE</div>
        <nav className="hidden md:flex items-center space-x-8 text-white">
          <a href="/" className="hover:text-blue-300 transition-colors">HOME</a>
          <a href="/contact" className="hover:text-blue-300 transition-colors">連絡先</a>
        </nav>
      </header>
      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-12 bg-gray-800/50 border border-gray-700 backdrop-blur-sm rounded-xl p-8 text-white">
        {/* 右：商品情報 */}
        <div className="flex-1 flex flex-col gap-6 justify-start items-center w-full max-w-full md:max-w-xl mx-auto">
          <h1 className="font-bold text-center">
            <span className="whitespace-nowrap text-base md:text-4xl block">新アドバンスマインド2025</span>
            <span className="text-xl md:text-5xl block md:mt-4">限定Ｔシャツ</span>
          </h1>
          <div className="flex-1 flex flex-col items-center">
            <Image src="/X-NAM-Tshirt.png" alt="新アドバンスマインド2025限定Tシャツ" width={400} height={400} className="rounded-xl bg-gray-900" />
          </div>
          <div className="text-gray-300 text-base text-center">
            {/* 商品説明文を削除 */}
          </div>
          <div className="w-full mb-4 md:mb-6">
            {/* PC用 */}
            <h2 className="hidden md:block text-base sm:text-lg font-bold mb-6 whitespace-nowrap text-left">ご希望のプランを選択してください。</h2>
            {/* スマホ用 */}
            <h2 className="md:hidden text-base font-bold mb-6 text-center whitespace-nowrap">ご希望のプランを選択して下さい。</h2>
            <div className="flex flex-col gap-4">
              <label className={`p-4 rounded border cursor-pointer ${selectedOption === "vip" ? "border-yellow-400 bg-yellow-50/10" : "border-gray-600 bg-gray-900/40"}`}>
                <div className="flex items-center">
                  <input type="radio" name="option" value="vip" checked={selectedOption === "vip"} onChange={() => setSelectedOption("vip")} className="mr-2 accent-yellow-400 w-5 h-5" />
                  <span>
                    <span className="font-bold text-xl md:text-2xl" style={{ color: '#D75F02' }}>VIPファミリー</span><br className="md:hidden" /><span className="text-xl md:text-2xl" style={{ color: '#D75F02' }}>（4700円/月）</span>
                  </span>
                </div>
                <ul className="text-sm mt-1 ml-5 md:ml-6 list-[lower-alpha] pl-5 md:pl-6">
                  <li>毎月最新バージョンのTシャツを配送</li>
                  <li className="mt-2 md:mt-0">デイリー仙人マインド<br className="md:hidden" />（仙人さんソロ・トーク10分間-毎朝6時メール配信）</li>
                  <li className="mt-2 md:mt-0">緊急・X-極秘ミーティング<br className="md:hidden" />（完全ソロトーク60分間-毎月の月末メール配信）</li>
                </ul>
              </label>
              <label className={`p-4 rounded border cursor-pointer ${selectedOption === "normal" ? "border-yellow-400 bg-yellow-50/10" : "border-gray-600 bg-gray-900/40"}`}>
                <div className="flex items-center">
                  <input type="radio" name="option" value="normal" checked={selectedOption === "normal"} onChange={() => setSelectedOption("normal")} className="mr-2 accent-yellow-400 w-5 h-5" />
                  <span>
                    <span className="font-bold text-xl md:text-2xl">Normalメンバー</span><br className="md:hidden" /><span className="text-xl md:text-2xl">（1700円/月）</span>
                  </span>
                </div>
                <ul className="text-sm mt-1 ml-5 md:ml-6 list-[lower-alpha] pl-5 md:pl-6">
                  <li>今回のみTシャツを配送</li>
                  <li className="mt-2 md:mt-0">デイリー仙人マインド<br className="md:hidden" />（仙人さんソロ・トーク10分間-毎朝6時メール配信）</li>
                </ul>
              </label>
              <label className={`p-4 rounded border cursor-pointer ${selectedOption === "tshirt" ? "border-yellow-400 bg-yellow-50/10" : "border-gray-600 bg-gray-900/40"}`}>
                <div className="flex items-center">
                  <input type="radio" name="option" value="tshirt" checked={selectedOption === "tshirt"} onChange={() => setSelectedOption("tshirt")} className="mr-2 accent-yellow-400 w-5 h-5" />
                  <span>
                    <span className="font-bold text-xl md:text-2xl">Tシャツのみ希望</span><br className="md:hidden" /><span className="text-xl md:text-2xl">（1470円）</span>
                  </span>
                </div>
                <ul className="text-sm mt-1 ml-5 md:ml-6 list-[lower-alpha] pl-5 md:pl-6">
                  <li>今回のみTシャツを配送</li>
                </ul>
              </label>
            </div>
          </div>
          <div className="w-full">
            <Elements stripe={stripePromise}>
              <PaymentForm
                selectedOption={selectedOption}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
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
      </div>
      <div className="mt-16" />
      <Footer />
    </div>
  );
} 