"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import ProductCard from "../../components/ProductCard";
import ProductDialog from "../../components/ProductDialog";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  attributes: {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    isActive: boolean;
    images: { data: Array<{ attributes: { url: string } }> };
    locale: string;
  };
}

interface FilterOptions {
  category: string;
  isActive: boolean | null;
  priceRange: { min: number; max: number };
  searchTerm: string;
}

export default function ProductsPage() {
  const t = useTranslations("Products");
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: "",
    isActive: null,
    priceRange: { min: 0, max: 10000 },
    searchTerm: ""
  });

  const categories = [
    "electronics",
    "clothing",
    "accessories",
    "home",
    "sports"
  ];

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.isActive !== null) queryParams.append("isActive", filters.isActive.toString());
      queryParams.append("minPrice", filters.priceRange.min.toString());
      queryParams.append("maxPrice", filters.priceRange.max.toString());
      if (filters.searchTerm) queryParams.append("search", filters.searchTerm);

      // First, fetch all stores
      const storesResponse = await fetch('/api/stores');
      if (!storesResponse.ok) throw new Error("Failed to fetch stores");
      const storesData = await storesResponse.json();

      // Fetch products from each store
      const allProducts = await Promise.all(
        storesData.data.map(async (store: any) => {
          const response = await fetch(`/api/deals?store_hostname=${store.hostname}&${queryParams.toString()}`);
          if (!response.ok) throw new Error(`Failed to fetch products from store ${store.name}`);
          const data = await response.json();
          return data.data.map((product: any) => ({
            ...product,
            store: {
              id: store.id,
              name: store.name,
              hostname: store.hostname
            }
          }));
        })
      );

      // Flatten the array of products and set them
      const flattenedProducts = allProducts.flat();
      setProducts(flattenedProducts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (confirm(t("confirm_delete"))) {
      try {
        const response = await fetch(`/api/deals/${productId}`, {
          method: "DELETE"
        });

        if (!response.ok) throw new Error(await response.text());
        
        setProducts(prev => prev.filter(p => p.id !== productId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleUpdate = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <div className="flex justify-center p-8">{t("loading")}</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 mt-[10%]">
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder={t("search")}
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            className="px-4 py-2 border rounded"
          />

          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="">{t("all_categories")}</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {t(`categories.${category}`)}
              </option>
            ))}
          </select>

          <select
            value={filters.isActive === null ? "" : filters.isActive.toString()}
            onChange={(e) => handleFilterChange("isActive", e.target.value === "" ? null : e.target.value === "true")}
            className="px-4 py-2 border rounded"
          >
            <option value="">{t("all_status")}</option>
            <option value="true">{t("active")}</option>
            <option value="false">{t("inactive")}</option>
          </select>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder={t("min_price")}
              value={filters.priceRange.min}
              onChange={(e) => handleFilterChange("priceRange", { ...filters.priceRange, min: e.target.value })}
              className="px-4 py-2 border rounded w-1/2"
            />
            <input
              type="number"
              placeholder={t("max_price")}
              value={filters.priceRange.max}
              onChange={(e) => handleFilterChange("priceRange", { ...filters.priceRange, max: e.target.value })}
              className="px-4 py-2 border rounded w-1/2"
            />
          </div>
        </div>
      </div>

      {/* Add Product Button */}
      <button
        onClick={handleAdd}
        className="mb-8 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        {t("add_product")}
      </button>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              name: product.attributes.name,
              description: product.attributes.description,
              price: product.attributes.price,
              images: product.attributes.images || [],
              isActive: product.attributes.isActive
            }}
            onDelete={() => handleDelete(product.id)}
            onUpdate={() => handleUpdate(product)}
          />
        ))}
      </div>

      {/* Product Dialog */}
      <ProductDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        product={selectedProduct}
        onSuccess={() => {
          setIsDialogOpen(false);
          fetchProducts();
        }}
      />
    </div>
  );
} 