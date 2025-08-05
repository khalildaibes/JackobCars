"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Package,
  Wrench,
  Car,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  DollarSign,
  Tag,
  Image,
  MoreHorizontal
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";

interface Store {
  id: string;
  name: string;
}

interface Category {
  id: number;
  name: string;
  slug?: string;
  description?: string;
}

interface Service {
  documentId: string;
  id: string;
  title: string; // API returns 'title' not 'name' (following store page pattern)
  name?: string; // Keep as fallback
  description: string;
  price: number;
  duration?: number; // in minutes - may not be in API response
  category?: string; // May not be in API response (legacy)
  categories?: Category[]; // New structure: array of category objects
  image?: string;
  isActive?: boolean; // May not be in API response
  createdAt?: string; // May not be in API response
}

interface Product {
  id: string;
  title?: string; // API might return 'title' like services
  name?: string; // Keep as fallback
  description: string;
  price: number;
  category?: string | Category[]; // Could be string or array for legacy
  categories?: string | Category[]; // Could be string or array (actual structure from JSON)
  brand?: string; // May not be in API response
  stock?: number; // May not be in API response
  sku?: string; // May not be in API response
  isActive?: boolean; // May not be in API response
  image?: string;
  createdAt?: string; // May not be in API response
}

interface Part {
  id: string;
  title?: string; // API might return 'title' like services
  name?: string; // Keep as fallback
  description: string;
  partNumber?: string; // May not be in API response
  brand?: string; // May not be in API response
  price: number;
  stock?: number; // May not be in API response
  minStock?: number; // May not be in API response
  category?: string; // May not be in API response (legacy)
  categories?: Category[]; // New structure: array of category objects
  isActive?: boolean; // May not be in API response
  createdAt?: string; // May not be in API response
}

interface ProductServiceManagementProps {
  storeId: string;
  store: Store;
}

export default function ProductServiceManagement({ storeId, store }: ProductServiceManagementProps) {
  const t = useTranslations("Dashboard");
  const { toast } = useToast();

  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [storeHostname, setStoreHostname] = useState<string>("");
  const [activeTab, setActiveTab] = useState("services");

  // Dialog states
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isPartDialogOpen, setIsPartDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states
  const [serviceForm, setServiceForm] = useState({
    title: "", // Use 'title' to match API (following store page pattern)
    description: "",
    price: "",
    duration: "",
    category: "",
  });

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    sku: "",
  });

  const [partForm, setPartForm] = useState({
    name: "",
    description: "",
    partNumber: "",
    brand: "",
    price: "",
    stock: "",
    minStock: "",
    category: "",
  });

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log('Store ID:', storeId);
        if(storeId === 'default') {
          storeId = 'ASD Auto Spa Detailing';
        }
        // First fetch store data to get the hostname (following store page pattern)
        const storeResponse = await fetch(`/api/stores?name=${storeId}`);
        if (!storeResponse.ok) throw new Error("Failed to fetch store");
        const storeDataResponse = await storeResponse.json();
        
        // Handle response structure - it might be an array or single object
        const storeData = storeDataResponse.data && Array.isArray(storeDataResponse.data) 
          ? storeDataResponse.data[0] 
          : storeDataResponse;
        
        if (!storeData) {
          throw new Error("Store not found");
        }

        let hostname = storeData.hostname || store.name;
        
        // Map 'default' to 'ASD Auto Spa Detailing' (following existing pattern)
        if (hostname === 'default') {
          hostname = 'ASD Auto Spa Detailing';
        }
        
        setStoreHostname(hostname);
        console.log('Store hostname:', hostname);
        

        // Always fetch services (following store page pattern)
        let servicesData = { data: [] };
        try {
          const servicesResponse = await fetch(`/api/services?store_hostname=${hostname}`);
          if (servicesResponse.ok) {
            servicesData = await servicesResponse.json();
            console.log('Services Data:', JSON.stringify(servicesData, null, 2));
          }
        } catch (error) {
          console.error("Failed to fetch services:", error);
        }

        // Fetch products and parts only if store has car-listing tag (following store page pattern)
        let productsData = { data: [] };
        let partsData = { data: [] };
        
        if (storeData.tags?.includes('car-listing')) {
          try {
            // Use /api/deals for products (following store page pattern)
            const productsResponse = await fetch(`/api/deals?store_hostname=${hostname}`);
            if (productsResponse.ok) {
              productsData = await productsResponse.json();
              console.log('Products Data:', JSON.stringify(productsData, null, 2));
            }
          } catch (error) {
            console.error("Failed to fetch products:", error);
          }

          try {
            const partsResponse = await fetch(`/api/parts?store_hostname=${hostname}`);
            if (partsResponse.ok) {
              partsData = await partsResponse.json();
              console.log('Parts Data:', JSON.stringify(partsData, null, 2));
            }
          } catch (error) {
            console.error("Failed to fetch parts:", error);
          }
        }

        // Set data using .data property (following store page pattern)
        setServices(servicesData.data || []);
        setProducts(productsData.data || []);
        setParts(partsData.data || []);

      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load store data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [storeId, store.name, toast]);

  // Reset filters when switching tabs
  useEffect(() => {
    setSearchTerm("");
    setCategoryFilter("all");
  }, [activeTab]);

  // Service management functions
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method =  editingItem ? "PUT" : "POST";
      const url = `/api/services/${editingItem.documentId}?store_hostname=${storeHostname}`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...serviceForm,
          storeId: storeHostname, // Use hostname as storeId (following store page pattern)
          price: parseFloat(serviceForm.price),
          categories: serviceForm.category, // Send as array of category IDs
          // duration: parseInt(serviceForm.duration),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (editingItem) {
          setServices(prev => prev.map(s => s.id === editingItem.id ? result.service : s));
          toast({ title: t("service_updated"), description: t("service_updated_successfully") });
        } else {
          setServices(prev => [...prev, result.service]);
          toast({ title: t("service_created"), description: t("service_created_successfully") });
        }

        resetServiceForm();
        setIsServiceDialogOpen(false);
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failed_to_save_service"),
        variant: "destructive",
      });
    }
  };

  const resetServiceForm = () => {
    setServiceForm({
      title: "", // Use 'title' to match API (following store page pattern)
      description: "",
      price: "",
      duration: "",
      category: "",
    });
    setEditingItem(null);
  };

  const editService = (service: Service) => {
    setServiceForm({
      title: service.title || service.name || "", // Use 'title' with fallback to 'name'
      description: service.description,
      price: service.price.toString(),
      duration: service.duration?.toString() || "60", // Default duration if not provided
      category: service.category || "", // Default to empty if not provided
    });
    setEditingItem(service);
    setIsServiceDialogOpen(true);
  };

  const deleteService = async (serviceId: string) => {
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setServices(prev => prev.filter(s => s.id !== serviceId));
        toast({ title: t("service_deleted"), description: t("service_deleted_successfully") });
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failed_to_delete_service"),
        variant: "destructive",
      });
    }
  };

  // Product management functions
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingItem ? "PUT" : "POST";
      const url = editingItem 
        ? `/api/products/${editingItem.documentId}`
        : `/api/products?store_hostname=${storeHostname}`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productForm,
          storeId: storeHostname,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (editingItem) {
          setProducts(prev => prev.map(p => p.id === editingItem.id ? result.product : p));
          toast({ title: t("product_updated"), description: t("product_updated_successfully") });
        } else {
          setProducts(prev => [...prev, result.product]);
          toast({ title: t("product_created"), description: t("product_created_successfully") });
        }

        resetProductForm();
        setIsProductDialogOpen(false);
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failed_to_save_product"),
        variant: "destructive",
      });
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      category: "",
      brand: "",
      stock: "",
      sku: "",
    });
    setEditingItem(null);
  };

  const editProduct = (product: Product) => {
    setProductForm({
      name: product.title || product.name || "",
      description: product.description,
      price: product.price.toString(),
      category: typeof product.category === "string" ? product.category : "",
      brand: product.brand || "",
      stock: product.stock?.toString() || "0",
      sku: product.sku || "",
    });
    setEditingItem(product);
    setIsProductDialogOpen(true);
  };

  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        toast({ title: t("product_deleted"), description: t("product_deleted_successfully") });
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failed_to_delete_product"),
        variant: "destructive",
      });
    }
  };

  // Part management functions
  const handlePartSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingItem ? "PUT" : "POST";
      const url = editingItem 
        ? `/api/parts/${editingItem.id}`
        : `/api/parts?store_hostname=${storeHostname}`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...partForm,
          storeId: storeHostname,
          price: parseFloat(partForm.price),
          stock: parseInt(partForm.stock),
          minStock: parseInt(partForm.minStock),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (editingItem) {
          setParts(prev => prev.map(p => p.id === editingItem.id ? result.part : p));
          toast({ title: t("part_updated"), description: t("part_updated_successfully") });
        } else {
          setParts(prev => [...prev, result.part]);
          toast({ title: t("part_created"), description: t("part_created_successfully") });
        }

        resetPartForm();
        setIsPartDialogOpen(false);
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failed_to_save_part"),
        variant: "destructive",
      });
    }
  };

  const resetPartForm = () => {
    setPartForm({
      name: "",
      description: "",
      partNumber: "",
      brand: "",
      price: "",
      stock: "",
      minStock: "",
      category: "",
    });
    setEditingItem(null);
  };

  const editPart = (part: Part) => {
    setPartForm({
      name: part.title || part.name || "",
      description: part.description,
      partNumber: part.partNumber || "",
      brand: part.brand || "",
      price: part.price.toString(),
      stock: part.stock?.toString() || "0",
      minStock: part.minStock?.toString() || "0",
      category: part.category || "",
    });
    setEditingItem(part);
    setIsPartDialogOpen(true);
  };

  const deletePart = async (partId: string) => {
    try {
      const response = await fetch(`/api/parts/${partId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setParts(prev => prev.filter(p => p.id !== partId));
        toast({ title: t("part_deleted"), description: t("part_deleted_successfully") });
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failed_to_delete_part"),
        variant: "destructive",
      });
    }
  };

  // Dynamic categories extracted from actual data with fallbacks
  const defaultServiceCategories = [
    // "basic_wash", "premium_wash", "full_detail", "interior_detail", 
    // "exterior_detail", "ceramic_coating", "paint_protection"
  ];
  
  const defaultProductCategories = [
    // "car_care", "accessories", "tools", "parts", "electronics"
  ];
  
  const defaultPartCategories = [
    // "engine", "transmission", "brakes", "suspension", "electrical", "body", "interior"
  ];

  // Extract unique categories from data and merge with defaults

  // Extract unique categories with IDs from services
  const dynamicServiceCategoriesMap = new Map();
  (services || [])
    .filter(service => service != null)
    .forEach(service => {
      if (service.categories && Array.isArray(service.categories)) {
        service.categories.forEach(cat => {
          if (cat.id && cat.name) {
            dynamicServiceCategoriesMap.set(cat.id, cat);
          }
        });
      }
    });
  
  const dynamicServiceCategories = Array.from(dynamicServiceCategoriesMap.values());
  
  // Create default categories with temporary IDs for backward compatibility
  const defaultCategoriesWithIds = defaultServiceCategories.map((name, index) => ({
    id: `default_${index}`,
    name: name
  }));
  
  const allServiceCategories = [
    ...defaultCategoriesWithIds,
    ...dynamicServiceCategories
  ];

  const dynamicProductCategories = Array.from(new Set(
    products.map(product => {
      // Handle both string and array structures
      if (typeof product.categories === 'string') {
        return product.categories;
      }
      if (Array.isArray(product.categories)) {
        return product.categories.map(cat => typeof cat === 'string' ? cat : cat.name).join(',');
      }
      if (Array.isArray(product.category)) {
        return product.category.map(cat => typeof cat === 'string' ? cat : cat.name).join(',');
      }
      return product.category;
    }).filter(Boolean).flatMap(cat => typeof cat === 'string' ? cat.split(',') : []).map(c => c.trim())
  ));
  const productCategories = Array.from(new Set([
    ...defaultProductCategories,
    ...dynamicProductCategories
  ]));

  const dynamicPartCategories = Array.from(new Set(
    (parts || [])
      .filter(part => part != null) // Filter out undefined/null parts
      .flatMap(part => 
        part.categories?.map(cat => cat.name) || []
      ).filter(Boolean)
  ));
  const partCategories = Array.from(new Set([
    ...defaultPartCategories,
    ...dynamicPartCategories
  ]));

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{t("products_services_management")}</h2>
          <p className="text-gray-600">{t("manage_store_catalog")}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("total_services")}</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">
              {services.length} {t("active")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("total_products")}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              {products.filter(p => p.isActive !== false).length} {t("in_stock")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("total_parts")}</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parts.length}</div>
            <p className="text-xs text-muted-foreground">
              {parts.filter(p => p.stock !== undefined && p.minStock !== undefined && p.stock <= p.minStock).length} {t("low_stock")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different categories */}
      <Tabs defaultValue="services" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">{t("services")}</TabsTrigger>
          <TabsTrigger value="products">{t("products")}</TabsTrigger>
          <TabsTrigger value="parts">{t("parts")}</TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t("search_services")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
                title={`${allServiceCategories.length} categories available`}
              >
                <option value="all">{t("all_categories")} ({allServiceCategories.length})</option>
                {allServiceCategories.map(cat => (
                  <option key={cat} value={cat}>{t(cat)}</option>
                ))}
              </select>
            </div>

            <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetServiceForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("add_service")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? t("edit_service") : t("add_new_service")}
                  </DialogTitle>
                  <DialogDescription>
                    {t("service_form_description")}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleServiceSubmit} className="space-y-4">
                  <div>
                    <Label>{t("service_name")}</Label>
                    <Input
                      value={serviceForm.title}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder={t("enter_service_name")}
                      required
                    />
                  </div>

                  <div>
                    <Label>{t("description")}</Label>
                    <Textarea
                      value={serviceForm.description}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder={t("enter_service_description")}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t("price")} ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={serviceForm.price}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <Label>{t("duration")} ({t("minutes")})</Label>
                      <Input
                        type="number"
                        value={serviceForm.duration}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="60"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>{t("category")} (Multi-select)</Label>
                    <div className="w-full p-2 border rounded-md max-h-40 overflow-y-auto">
                      <div className="text-sm text-gray-600 mb-2">
                        {t("select_category")} ({allServiceCategories.length} available)
                      </div>
                      {allServiceCategories.map(cat => (
                        <label key={cat.id} className="flex items-center gap-2 mb-1 cursor-pointer hover:bg-gray-50 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={serviceForm.category?.includes(cat.id) || false}
                            onChange={(e) => {
                              const categoryId = cat.id;
                              setServiceForm(prev => ({
                                ...prev,
                                categories: e.target.checked
                                  ? [...(prev.category || []), categoryId]
                                  : (prev.category || []).filter(id => id !== categoryId)
                              }));
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">
                            {cat.name} <span className="text-gray-500">(ID: {cat.id})</span>
                          </span>
                        </label>
                      ))}
                      {allServiceCategories.length === 0 && (
                        <div className="text-sm text-gray-500 italic">No categories available</div>
                      )}
                    </div>
                      {serviceForm.category && serviceForm.category.length > 0 && (
                      <div className="mt-2 text-sm text-blue-600">
                        Selected: {serviceForm.category.join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingItem ? t("update_service") : t("create_service")}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsServiceDialogOpen(false)}
                    >
                      {t("cancel")}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Services List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services
              .filter(service => {
                // Category filter
                const matchesCategory = categoryFilter === "all" || (() => {
                  // Handle service categories (array of objects with name property)
                  if (service.categories && Array.isArray(service.categories)) {
                    return service.categories.some(cat => cat.name === categoryFilter);
                  }
                  // Fallback to category field if it exists
                  return service.category === categoryFilter;
                })();
                
                // Search filter
                const matchesSearch = searchTerm === "" || 
                  (service.title || service.name || "").toLowerCase().includes(searchTerm.toLowerCase());
                
                return matchesCategory && matchesSearch;
              })
              .map((service) => (
                <motion.div
                  key={service?.documentId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{service?.title || service?.name }{service?.id}</CardTitle>
                          {/* Display service categories */}
                          {service?.categories && Array.isArray(service?.categories) && service?.categories.length > 0 ? (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {service?.categories.map((cat, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {cat.name}
                                </Badge>
                              ))}
                            </div>
                          ) : service?.category && (
                            <Badge variant="secondary" className="mt-1">
                              {service?.category}
                            </Badge>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => editService(service)}>
                              <Edit className="h-4 w-4 mr-2" />
                              {t("edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deleteService(service.documentId)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t("delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {service?.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-semibold">${service?.price}</span>
                        </div>
                        {service?.duration && (
                          <div className="flex items-center gap-2">
                            {/* <Clock className="h-4 w-4 text-blue-600" /> */}
                            <span className="text-sm">{service?.duration}min</span>
                          </div>
                        )}
                      </div>
                        {service?.isActive !== undefined && (
                        <div className="mt-3 flex justify-between items-center">
                          <Badge variant={service?.isActive ? "default" : "secondary"}>
                            {service?.isActive ? t("active") : t("inactive")}
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>

          {services.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center">
                <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("no_services")}</h3>
                <p className="text-gray-600 mb-4">{t("no_services_desc")}</p>
                <Button onClick={() => setIsServiceDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("add_first_service")}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t("search_products")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
                title={`${productCategories.length} categories available`}
              >
                <option value="all">{t("all_categories")} ({productCategories.length})</option>
                {productCategories.map(cat => (
                  <option key={cat} value={cat}>{t(cat)}</option>
                ))}
              </select>
            </div>

            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetProductForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("add_product")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? t("edit_product") : t("add_new_product")}
                  </DialogTitle>
                  <DialogDescription>
                    {t("product_form_description")}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div>
                    <Label>{t("product_name")}</Label>
                    <Input
                      value={productForm.name}
                      onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={t("enter_product_name")}
                      required
                    />
                  </div>

                  <div>
                    <Label>{t("description")}</Label>
                    <Textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder={t("enter_product_description")}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t("price")} ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <Label>{t("stock")}</Label>
                      <Input
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t("brand")}</Label>
                      <Input
                        value={productForm.brand}
                        onChange={(e) => setProductForm(prev => ({ ...prev, brand: e.target.value }))}
                        placeholder={t("enter_brand")}
                      />
                    </div>
                    <div>
                      <Label>{t("sku")}</Label>
                      <Input
                        value={productForm.sku}
                        onChange={(e) => setProductForm(prev => ({ ...prev, sku: e.target.value }))}
                        placeholder={t("enter_sku")}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>{t("category")}</Label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                      required
                      title={`Choose from ${productCategories.length} available categories`}
                    >
                      <option value="">{t("select_category")} ({productCategories.length} available)</option>
                      {productCategories.map(cat => (
                        <option key={cat} value={cat}>{t(cat)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingItem ? t("update_product") : t("create_product")}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsProductDialogOpen(false)}
                    >
                      {t("cancel")}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Products List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products
              .filter(product => {
                // Category filter
                const matchesCategory = categoryFilter === "all" || (() => {
                  // Handle product categories (could be string or array)
                  if (typeof product.categories === 'string') {
                    return product.categories.split(',').some(cat => cat.trim() === categoryFilter);
                  }
                  if (Array.isArray(product.categories)) {
                    return product.categories.some(cat => 
                      (typeof cat === 'string' ? cat : cat.name) === categoryFilter
                    );
                  }
                  if (Array.isArray(product.category)) {
                    return product.category.some(cat => 
                      (typeof cat === 'string' ? cat : cat.name) === categoryFilter
                    );
                  }
                  // Fallback to category field
                  return product.category === categoryFilter;
                })();
                
                // Search filter
                const matchesSearch = searchTerm === "" || 
                  (product.title || product.name || "").toLowerCase().includes(searchTerm.toLowerCase());
                
                return matchesCategory && matchesSearch;
              })
              .map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{product.title || product.name}</CardTitle>
                          {/* Display product categories */}
                          {(() => {
                            // Handle different category structures for products
                            if (typeof product.categories === 'string' && product.categories) {
                              return (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {product.categories.split(',').map((cat, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {t(cat.trim())}
                                    </Badge>
                                  ))}
                                </div>
                              );
                            }
                            if (Array.isArray(product.categories) && product.categories.length > 0) {
                              return (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {product.categories.map((cat, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {t(typeof cat === 'string' ? cat : cat.name)}
                                    </Badge>
                                  ))}
                                </div>
                              );
                            }
                            if (Array.isArray(product.category) && product.category.length > 0) {
                              return (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {product.category.map((cat, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {t(typeof cat === 'string' ? cat : cat.name)}
                                    </Badge>
                                  ))}
                                </div>
                              );
                            }
                            if (product.category) {
                              return (
                                <Badge variant="secondary" className="mt-1">
                                  {t(product.category)}
                                </Badge>
                              );
                            }
                            return null;
                          })()}
                          {product.brand && (
                            <p className="text-sm text-gray-500 mt-1">{product.brand}</p>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => editProduct(product)}>
                              <Edit className="h-4 w-4 mr-2" />
                              {t("edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deleteProduct(product.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t("delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-semibold">${product.price}</span>
                        </div>
                        {product.stock !== undefined && (
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">{product.stock} {t("in_stock")}</span>
                          </div>
                        )}
                      </div>
                      {product.sku && (
                        <p className="text-xs text-gray-500 mt-2">SKU: {product.sku}</p>
                      )}
                      {product.isActive !== undefined && (
                        <div className="mt-3 flex justify-between items-center">
                          <Badge variant={product.isActive ? "default" : "secondary"}>
                            {product.isActive ? t("active") : t("inactive")}
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>

          {products.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("no_products")}</h3>
                <p className="text-gray-600 mb-4">{t("no_products_desc")}</p>
                <Button onClick={() => setIsProductDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("add_first_product")}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Parts Tab */}
        <TabsContent value="parts" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t("search_parts")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
                title={`${partCategories.length} categories available`}
              >
                <option value="all">{t("all_categories")} ({partCategories.length})</option>
                {partCategories.map(cat => (
                  <option key={cat} value={cat}>{t(cat)}</option>
                ))}
              </select>
            </div>

            <Dialog open={isPartDialogOpen} onOpenChange={setIsPartDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetPartForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("add_part")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? t("edit_part") : t("add_new_part")}
                  </DialogTitle>
                  <DialogDescription>
                    {t("part_form_description")}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePartSubmit} className="space-y-4">
                  <div>
                    <Label>{t("part_name")}</Label>
                    <Input
                      value={partForm.name}
                      onChange={(e) => setPartForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={t("enter_part_name")}
                      required
                    />
                  </div>

                  <div>
                    <Label>{t("description")}</Label>
                    <Textarea
                      value={partForm.description}
                      onChange={(e) => setPartForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder={t("enter_part_description")}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t("part_number")}</Label>
                      <Input
                        value={partForm.partNumber}
                        onChange={(e) => setPartForm(prev => ({ ...prev, partNumber: e.target.value }))}
                        placeholder={t("enter_part_number")}
                      />
                    </div>
                    <div>
                      <Label>{t("brand")}</Label>
                      <Input
                        value={partForm.brand}
                        onChange={(e) => setPartForm(prev => ({ ...prev, brand: e.target.value }))}
                        placeholder={t("enter_brand")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>{t("price")} ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={partForm.price}
                        onChange={(e) => setPartForm(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <Label>{t("stock")}</Label>
                      <Input
                        type="number"
                        value={partForm.stock}
                        onChange={(e) => setPartForm(prev => ({ ...prev, stock: e.target.value }))}
                        placeholder="0"
                        required
                      />
                    </div>
                    <div>
                      <Label>{t("min_stock")}</Label>
                      <Input
                        type="number"
                        value={partForm.minStock}
                        onChange={(e) => setPartForm(prev => ({ ...prev, minStock: e.target.value }))}
                        placeholder="5"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>{t("category")}</Label>
                    <select
                      value={partForm.category}
                      onChange={(e) => setPartForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                      required
                      title={`Choose from ${partCategories.length} available categories`}
                    >
                      <option value="">{t("select_category")} ({partCategories.length} available)</option>
                      {partCategories.map(cat => (
                        <option key={cat} value={cat}>{t(cat)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingItem ? t("update_part") : t("create_part")}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsPartDialogOpen(false)}
                    >
                      {t("cancel")}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Parts List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {parts
              .filter(part => {
                // Category filter
                const matchesCategory = categoryFilter === "all" || (() => {
                  // Handle part categories (array of objects with name property)
                  if (part.categories && Array.isArray(part.categories)) {
                    return part.categories.some(cat => cat.name === categoryFilter);
                  }
                  // Fallback to category field if it exists
                  return part.category === categoryFilter;
                })();
                
                // Search filter
                const matchesSearch = searchTerm === "" || 
                  (part.title || part.name || "").toLowerCase().includes(searchTerm.toLowerCase());
                
                return matchesCategory && matchesSearch;
              })
              .map((part) => (
                <motion.div
                  key={part.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{part.title || part.name}</CardTitle>
                          {/* Display part categories */}
                          {part.categories && Array.isArray(part.categories) && part.categories.length > 0 ? (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {part.categories.map((cat, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {t(cat.name)}
                                </Badge>
                              ))}
                            </div>
                          ) : part.category && (
                            <Badge variant="secondary" className="mt-1">
                              {t(part.category)}
                            </Badge>
                          )}
                          {part.partNumber && (
                            <p className="text-xs text-gray-500 mt-1">PN: {part.partNumber}</p>
                          )}
                          {part.brand && (
                            <p className="text-sm text-gray-500">{part.brand}</p>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => editPart(part)}>
                              <Edit className="h-4 w-4 mr-2" />
                              {t("edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deletePart(part.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t("delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {part.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-semibold">${part.price}</span>
                        </div>
                        {part.stock !== undefined && (
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">{part.stock} {t("available")}</span>
                          </div>
                        )}
                      </div>
                      {part.stock !== undefined && part.minStock !== undefined && (
                        <div className="mt-2">
                          <Badge 
                            variant={part.stock <= part.minStock ? "destructive" : "default"}
                            className="text-xs"
                          >
                            {part.stock <= part.minStock ? t("low_stock") : t("in_stock")}
                          </Badge>
                        </div>
                      )}
                      {part.isActive !== undefined && (
                        <div className="mt-3 flex justify-between items-center">
                          <Badge variant={part.isActive ? "default" : "secondary"}>
                            {part.isActive ? t("active") : t("inactive")}
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>

          {parts.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center">
                <Car className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("no_parts")}</h3>
                <p className="text-gray-600 mb-4">{t("no_parts_desc")}</p>
                <Button onClick={() => setIsPartDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("add_first_part")}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}