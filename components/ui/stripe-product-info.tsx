"use client"
import { useState, useEffect } from 'react';

interface StripeProduct {
  id: string;
  name: string;
  description: string | null;
  metadata: Record<string, string>;
  default_price?: {
    id: string;
    unit_amount: number;
    currency: string;
  };
}

interface StripePrice {
  id: string;
  unit_amount: number;
  currency: string;
  recurring?: {
    interval: string;
    interval_count: number;
  };
  product: StripeProduct;
}

interface StripeProductInfoProps {
  selectedOption: string;
}

export default function StripeProductInfo({ selectedOption }: StripeProductInfoProps) {
  const [products, setProducts] = useState<StripeProduct[]>([]);
  const [prices, setPrices] = useState<StripePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStripeData = async () => {
      try {
        const response = await fetch('/api/get-products');
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          setProducts(data.products);
          setPrices(data.prices);
        }
      } catch (err) {
        setError('商品情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchStripeData();
  }, []);

  if (loading) {
    return <div className="text-gray-400 text-sm">商品情報を読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-sm">エラー: {error}</div>;
  }

  // 選択されたオプションに対応する商品を検索
  const getProductByOption = () => {
    const optionMap: Record<string, string> = {
      'vip': 'VIPファミリー',
      'normal': 'Normalメンバー', 
      'tshirt': 'Tシャツのみ希望'
    };

    const productName = optionMap[selectedOption];
    return products.find(p => p.name.includes(productName) || p.metadata.option === selectedOption);
  };

  const selectedProduct = getProductByOption();
  const selectedPrice = prices.find(p => p.product.id === selectedProduct?.id);

  if (!selectedProduct) {
    return (
      <div className="bg-gray-800/50 p-4 rounded-lg mt-4">
        <h3 className="text-lg font-semibold text-white mb-2">Stripe商品情報</h3>
        <p className="text-gray-400 text-sm">対応する商品が見つかりません</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg mt-4">
      <h3 className="text-lg font-semibold text-white mb-3">Stripe商品情報</h3>
      
      <div className="space-y-3 text-sm">
        <div>
          <span className="text-gray-400">商品名:</span>
          <span className="text-white ml-2">{selectedProduct.name}</span>
        </div>
        
        {selectedProduct.description && (
          <div>
            <span className="text-gray-400">説明:</span>
            <span className="text-white ml-2">{selectedProduct.description}</span>
          </div>
        )}
        
        <div>
          <span className="text-gray-400">商品ID:</span>
          <span className="text-white ml-2 font-mono text-xs">{selectedProduct.id}</span>
        </div>
        
        {selectedPrice && (
          <div>
            <span className="text-gray-400">価格ID:</span>
            <span className="text-white ml-2 font-mono text-xs">{selectedPrice.id}</span>
          </div>
        )}
        
        {selectedProduct.metadata && Object.keys(selectedProduct.metadata).length > 0 && (
          <div>
            <span className="text-gray-400">メタデータ:</span>
            <div className="ml-2 mt-1">
              {Object.entries(selectedProduct.metadata).map(([key, value]) => (
                <div key={key} className="text-white">
                  <span className="text-gray-400">{key}:</span>
                  <span className="ml-1">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {selectedPrice?.recurring && (
          <div>
            <span className="text-gray-400">課金間隔:</span>
            <span className="text-white ml-2">
              {selectedPrice.recurring.interval_count} {selectedPrice.recurring.interval}
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 