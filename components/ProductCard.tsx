import Image from "next/image";
import { useTranslations } from "next-intl";

interface Product {
  images: any;
  id: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
}

interface ProductCardProps {
  product: Product;
  onDelete: () => void;
  onUpdate: () => void;
}

export default function ProductCard({ product, onDelete, onUpdate }: ProductCardProps) {
  const t = useTranslations("Products");

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-48">
        <Image
          src={product?.images[0]?.url || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <div 
          className="text-gray-600 text-sm mb-2 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold">${product.price}</span>
          <span className={`px-2 py-1 rounded text-sm ${
            product.isActive ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
          }`}>
            {product.isActive ? t("active") : t("inactive")}
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <button
            onClick={onUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex-1"
          >
            {t("update")}
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex-1"
          >
            {t("delete")}
          </button>
        </div>
      </div>
    </div>
  );
} 