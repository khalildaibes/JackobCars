"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import dynamic from 'next/dynamic';
import { Plus, Minus, X } from 'lucide-react';

// Import JSON Editor dynamically to avoid SSR issues
const JSONEditor = dynamic(
  () => import('react-json-editor-ajrm').then((mod) => mod.default),
  { ssr: false }
);

interface CarDetails {
  car: {
    cons: string[];
    pros: string[];
    fuel: string;
    name: string;
    year: number;
    miles: string;
    price: number;
    body_type: string;
    mileage: string;
    transmission: string;
    dimensions_capacity: Array<{ label: string; value: string }>;
    engine_transmission_details: Array<{ label: string; value: string }>;
  }
}

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess: () => void;
}

export default function ProductDialog({ isOpen, onClose, product, onSuccess }: ProductDialogProps) {
  const t = useTranslations("Products");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedLocale, setSelectedLocale] = useState("en");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    isActive: true,
    images: [] as File[]
  });
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [productType, setProductType] = useState("regular");
  const [carDetails, setCarDetails] = useState<CarDetails>({
    car: {
      cons: [""],
      pros: [""],
      fuel: "",
      name: "",
      year: new Date().getFullYear(),
      miles: "0 miles",
      price: 0,
      body_type: "",
      mileage: "",
      transmission: "Automatic",
      dimensions_capacity: [
        { label: "Width", value: "" },
        { label: "Gross Vehicle Weight (kg)", value: "" },
        { label: "Max. Loading Weight (kg)", value: "" },
        { label: "No. of Seats", value: "" }
      ],
      engine_transmission_details: [
        { label: "Engine Type", value: "" },
        { label: "Horsepower", value: "" },
        { label: "Torque", value: "" },
        { label: "Transmission", value: "" },
        { label: "Drivetrain", value: "" }
      ]
    }
  });

  const categories = [
    "electronics",
    "clothing",
    "accessories",
    "home",
    "sports"
  ];

  // Reset form when dialog opens/closes or product changes
  useEffect(() => {
    if (isOpen && product) {
      // Set the locale from the product
      setSelectedLocale(product.locale || "en");
      
      // Set form data from product
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        category: product.category || "",
        stock: product.stock || 0,
        isActive: product.isActive || false,
        images: []
      });

      // Set image previews from existing product images
      const existingImages = product.images?.data?.map(
        img => img.url
      ) || [];
      setImagePreview(existingImages);

      // Check if product has car details
      if (product.details?.car) {
        setProductType("car");
        setCarDetails(product.details);
      } else {
        setProductType("regular");
        setCarDetails({
          car: {
            cons: [""],
            pros: [""],
            fuel: "",
            name: "",
            year: new Date().getFullYear(),
            miles: "0 miles",
            price: 0,
            body_type: "",
            mileage: "",
            transmission: "Automatic",
            dimensions_capacity: [
              { label: "Width", value: "" },
              { label: "Gross Vehicle Weight (kg)", value: "" },
              { label: "Max. Loading Weight (kg)", value: "" },
              { label: "No. of Seats", value: "" }
            ],
            engine_transmission_details: [
              { label: "Engine Type", value: "" },
              { label: "Horsepower", value: "" },
              { label: "Torque", value: "" },
              { label: "Transmission", value: "" },
              { label: "Drivetrain", value: "" }
            ]
          }
        });
      }
    } else if (!product) {
      // Reset form for new product
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: "",
        stock: 0,
        isActive: true,
        images: []
      });
      setImagePreview([]);
      setSelectedLocale("en");
      setProductType("regular");
      setCarDetails({
        car: {
          cons: [""],
          pros: [""],
          fuel: "",
          name: "",
          year: new Date().getFullYear(),
          miles: "0 miles",
          price: 0,
          body_type: "",
          mileage: "",
          transmission: "Automatic",
          dimensions_capacity: [
            { label: "Width", value: "" },
            { label: "Gross Vehicle Weight (kg)", value: "" },
            { label: "Max. Loading Weight (kg)", value: "" },
            { label: "No. of Seats", value: "" }
          ],
          engine_transmission_details: [
            { label: "Engine Type", value: "" },
            { label: "Horsepower", value: "" },
            { label: "Torque", value: "" },
            { label: "Transmission", value: "" },
            { label: "Drivetrain", value: "" }
          ]
        }
      });
    }
  }, [isOpen, product]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...filesArray]
      }));

      // Create preview URLs for new images
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreview(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let finalFormData = { ...formData };
      
      // Add details if product type is car
      if (productType === "car") {
        finalFormData.details = carDetails;
      }

      // First, translate the content if needed
      let translatedContent = finalFormData;
      if (selectedLocale !== "en") {
        const translateResponse = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: [finalFormData.name, finalFormData.description],
            targetLanguage: selectedLocale
          })
        });
        const translations = await translateResponse.json();
        translatedContent = {
          ...finalFormData,
          name: translations[0],
          description: translations[1]
        };
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();
      Object.entries(translatedContent).forEach(([key, value]) => {
        if (key === "details") {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (key !== "images") {
          formDataToSend.append(key, value.toString());
        }
      });
      
      translatedContent.images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      formDataToSend.append("locale", selectedLocale);

      const url = product 
        ? `/api/deals/${product.id}`
        : "/api/deals";
        
      const response = await fetch(url, {
        method: product ? "PUT" : "POST",
        body: formDataToSend
      });

      if (!response.ok) throw new Error(await response.text());

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add array field handler
  const handleArrayField = (
    type: 'pros' | 'cons',
    index: number,
    value: string
  ) => {
    setCarDetails(prev => ({
      ...prev,
      car: {
        ...prev.car,
        [type]: prev.car[type].map((item, i) => i === index ? value : item)
      }
    }));
  };

  // Add/remove array items
  const handleArrayAction = (
    type: 'pros' | 'cons',
    action: 'add' | 'remove',
    index?: number
  ) => {
    setCarDetails(prev => ({
      ...prev,
      car: {
        ...prev.car,
        [type]: action === 'add'
          ? [...prev.car[type], ""]
          : prev.car[type].filter((_, i) => i !== index)
      }
    }));
  };

  // Handle specifications
  const handleSpecField = (
    type: 'dimensions_capacity' | 'engine_transmission_details',
    index: number,
    field: 'label' | 'value',
    value: string
  ) => {
    setCarDetails(prev => ({
      ...prev,
      car: {
        ...prev.car,
        [type]: prev.car[type].map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {product ? t("edit_product") : t("add_product")}
          </h2>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("language")}
              </label>
              <select
                value={selectedLocale}
                onChange={(e) => setSelectedLocale(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="he-IL">עברית</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t("product_type")}
              </label>
              <select
                value={productType}
                onChange={(e) => {
                  setProductType(e.target.value);
                  if (e.target.value === "car") {
                    setCarDetails({
                      car: {
                        cons: [""],
                        pros: [""],
                        fuel: "",
                        name: "",
                        year: new Date().getFullYear(),
                        miles: "0 miles",
                        price: 0,
                        body_type: "",
                        mileage: "",
                        transmission: "Automatic",
                        dimensions_capacity: [
                          { label: "Width", value: "" },
                          { label: "Gross Vehicle Weight (kg)", value: "" },
                          { label: "Max. Loading Weight (kg)", value: "" },
                          { label: "No. of Seats", value: "" }
                        ],
                        engine_transmission_details: [
                          { label: "Engine Type", value: "" },
                          { label: "Horsepower", value: "" },
                          { label: "Torque", value: "" },
                          { label: "Transmission", value: "" },
                          { label: "Drivetrain", value: "" }
                        ]
                      }
                    });
                  }
                }}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="regular">{t("regular_product")}</option>
                <option value="car">{t("car")}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t("product_name")}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t("description")}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("price")}
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("category")}
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  required
                >
                  <option value="">{t("select_category")}</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {t(`categories.${category}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("stock")}
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("status")}
                </label>
                <select
                  name="isActive"
                  value={formData.isActive.toString()}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="true">{t("active")}</option>
                  <option value="false">{t("inactive")}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t("images")}
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                multiple
                accept="image/*"
                className="w-full px-4 py-2 border rounded"
              />
            </div>

            {imagePreview.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreview.map((url, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      width={200}
                      height={200}
                      className="rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Basic Car Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("car_name")}
                </label>
                <input
                  type="text"
                  value={carDetails.car.name}
                  onChange={(e) => setCarDetails(prev => ({
                    ...prev,
                    car: { ...prev.car, name: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("year")}
                </label>
                <input
                  type="number"
                  value={carDetails.car.year}
                  onChange={(e) => setCarDetails(prev => ({
                    ...prev,
                    car: { ...prev.car, year: parseInt(e.target.value) }
                  }))}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("mileage")}
                </label>
                <input
                  type="text"
                  value={carDetails.car.miles}
                  onChange={(e) => setCarDetails(prev => ({
                    ...prev,
                    car: { ...prev.car, miles: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("fuel_type")}
                </label>
                <input
                  type="text"
                  value={carDetails.car.fuel}
                  onChange={(e) => setCarDetails(prev => ({
                    ...prev,
                    car: { ...prev.car, fuel: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
            </div>

            {/* Pros Section */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("pros")}
              </label>
              {carDetails.car.pros.map((pro, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={pro}
                    onChange={(e) => handleArrayField('pros', index, e.target.value)}
                    className="flex-1 px-4 py-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayAction('pros', 'remove', index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleArrayAction('pros', 'add')}
                className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                <Plus size={16} /> {t("add_pro")}
              </button>
            </div>

            {/* Cons Section */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("cons")}
              </label>
              {carDetails.car.cons.map((con, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={con}
                    onChange={(e) => handleArrayField('cons', index, e.target.value)}
                    className="flex-1 px-4 py-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayAction('cons', 'remove', index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleArrayAction('cons', 'add')}
                className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                <Plus size={16} /> {t("add_con")}
              </button>
            </div>

            {/* Dimensions & Capacity */}
            <div>
              <h3 className="font-medium mb-3">{t("dimensions_capacity")}</h3>
              {carDetails.car.dimensions_capacity.map((spec, index) => (
                <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    value={spec.label}
                    onChange={(e) => handleSpecField('dimensions_capacity', index, 'label', e.target.value)}
                    placeholder={t("spec_label")}
                    className="px-4 py-2 border rounded"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecField('dimensions_capacity', index, 'value', e.target.value)}
                    placeholder={t("spec_value")}
                    className="px-4 py-2 border rounded"
                  />
                </div>
              ))}
            </div>

            {/* Engine & Transmission Details */}
            <div>
              <h3 className="font-medium mb-3">{t("engine_transmission")}</h3>
              {carDetails.car.engine_transmission_details.map((spec, index) => (
                <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    value={spec.label}
                    onChange={(e) => handleSpecField('engine_transmission_details', index, 'label', e.target.value)}
                    placeholder={t("spec_label")}
                    className="px-4 py-2 border rounded"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecField('engine_transmission_details', index, 'value', e.target.value)}
                    placeholder={t("spec_value")}
                    className="px-4 py-2 border rounded"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? t("saving") : product ? t("update") : t("create")}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                {t("cancel")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 