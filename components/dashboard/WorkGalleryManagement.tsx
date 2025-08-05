"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Camera,
  Upload,
  Trash2,
  Edit,
  Eye,
  Grid,
  List,
  Filter,
  Search,
  Plus,
  Image as ImageIcon,
  Star,
  Tag,
  Calendar,
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
import Image from "next/image";

interface Store {
  id: string;
  name: string;
}

interface WorkImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  serviceType: string;
  tags: string[];
  isFeatured: boolean;
  isBeforeAfter: boolean;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  customerCar?: {
    make: string;
    model: string;
    year: string;
    plateNumber: string;
  };
  createdAt: string;
}

interface WorkGalleryManagementProps {
  storeId: string;
  store: Store;
}

export default function WorkGalleryManagement({ storeId, store }: WorkGalleryManagementProps) {
  const t = useTranslations("Dashboard");
  const { toast } = useToast();

  const [images, setImages] = useState<WorkImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<WorkImage | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    category: "",
    serviceType: "",
    tags: "",
    isFeatured: false,
    isBeforeAfter: false,
    carMake: "",
    carModel: "",
    carYear: "",
    plateNumber: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<{
    main?: File;
    before?: File;
    after?: File;
  }>({});

  const categories = [
    "exterior_detail",
    "interior_detail", 
    "paint_correction",
    "ceramic_coating",
    "before_after",
    "customer_cars",
    "equipment",
    "team_work"
  ];

  const serviceTypes = [
    "basic_wash",
    "premium_wash",
    "full_detail",
    "interior_detail",
    "exterior_detail",
    "ceramic_coating",
    "paint_protection"
  ];

  // Load images
  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetch(`/api/work-gallery?storeId=${storeId}`);
        if (response.ok) {
          const data = await response.json();
          setImages(data.images || []);
        }
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [storeId]);

  // Handle file upload
  const handleFileChange = (type: 'main' | 'before' | 'after') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      setUploadedFiles(prev => ({ ...prev, main: imageFiles[0] }));
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  // Submit upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadedFiles.main && !uploadedFiles.before && !uploadedFiles.after) {
      toast({
        title: t("error"),
        description: t("please_select_image"),
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      
      // Add form fields
      Object.entries(uploadForm).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      
      formData.append('storeId', storeId);
      
      // Add files
      if (uploadedFiles.main) formData.append('mainImage', uploadedFiles.main);
      if (uploadedFiles.before) formData.append('beforeImage', uploadedFiles.before);
      if (uploadedFiles.after) formData.append('afterImage', uploadedFiles.after);

      const response = await fetch('/api/work-gallery', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setImages(prev => [result.image, ...prev]);
        
        toast({
          title: t("image_uploaded"),
          description: t("image_uploaded_successfully"),
        });

        // Reset form
        setUploadForm({
          title: "",
          description: "",
          category: "",
          serviceType: "",
          tags: "",
          isFeatured: false,
          isBeforeAfter: false,
          carMake: "",
          carModel: "",
          carYear: "",
          plateNumber: "",
        });
        setUploadedFiles({});
        setIsUploadDialogOpen(false);
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failed_to_upload_image"),
        variant: "destructive",
      });
    }
  };

  // Delete image
  const deleteImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/work-gallery/${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setImages(prev => prev.filter(img => img.id !== imageId));
        toast({
          title: t("image_deleted"),
          description: t("image_deleted_successfully"),
        });
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failed_to_delete_image"),
        variant: "destructive",
      });
    }
  };

  // Toggle featured status
  const toggleFeatured = async (imageId: string) => {
    try {
      const response = await fetch(`/api/work-gallery/${imageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          isFeatured: !images.find(img => img.id === imageId)?.isFeatured 
        }),
      });

      if (response.ok) {
        setImages(prev => prev.map(img => 
          img.id === imageId 
            ? { ...img, isFeatured: !img.isFeatured }
            : img
        ));
      }
    } catch (error) {
      console.error("Error toggling featured status:", error);
    }
  };

  // Filter images
  const filteredImages = images.filter(image => {
    const matchesSearch = searchTerm === "" || 
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === "all" || image.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

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
          <h2 className="text-2xl font-bold">{t("work_gallery_management")}</h2>
          <p className="text-gray-600">{t("manage_work_images")}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">{t("total_images")}</p>
                <p className="text-2xl font-bold">{images.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">{t("featured")}</p>
                <p className="text-2xl font-bold">{images.filter(img => img.isFeatured).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">{t("before_after")}</p>
                <p className="text-2xl font-bold">{images.filter(img => img.isBeforeAfter).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">{t("this_month")}</p>
                <p className="text-2xl font-bold">
                  {images.filter(img => {
                    const imgDate = new Date(img.createdAt);
                    const now = new Date();
                    return imgDate.getMonth() === now.getMonth() && imgDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t("search_images")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">{t("all_categories")}</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{t(cat)}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t("upload_images")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{t("upload_work_images")}</DialogTitle>
                    <DialogDescription>
                      {t("upload_work_images_desc")}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleUploadSubmit} className="space-y-4">
                    {/* File Upload Area */}
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium mb-2">{t("drag_drop_images")}</p>
                      <p className="text-sm text-gray-600 mb-4">{t("or_click_to_select")}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>{uploadForm.isBeforeAfter ? t("before_image") : t("main_image")}</Label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange('main')}
                            className="mt-1"
                          />
                        </div>
                        
                        {uploadForm.isBeforeAfter && (
                          <div>
                            <Label>{t("after_image")}</Label>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange('after')}
                              className="mt-1"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>{t("title")}</Label>
                        <Input
                          value={uploadForm.title}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder={t("enter_image_title")}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label>{t("category")}</Label>
                        <select
                          value={uploadForm.category}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full p-2 border rounded-md"
                          required
                        >
                          <option value="">{t("select_category")}</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{t(cat)}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label>{t("description")}</Label>
                      <Textarea
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder={t("enter_image_description")}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>{t("service_type")}</Label>
                        <select
                          value={uploadForm.serviceType}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, serviceType: e.target.value }))}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">{t("select_service_type")}</option>
                          {serviceTypes.map(service => (
                            <option key={service} value={service}>{t(service)}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <Label>{t("tags")}</Label>
                        <Input
                          value={uploadForm.tags}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                          placeholder={t("enter_tags_comma_separated")}
                        />
                      </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={uploadForm.isFeatured}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                        />
                        <span className="text-sm">{t("feature_this_image")}</span>
                      </label>
                      
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={uploadForm.isBeforeAfter}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, isBeforeAfter: e.target.checked }))}
                        />
                        <span className="text-sm">{t("before_after_comparison")}</span>
                      </label>
                    </div>

                    {/* Customer Car Details (conditional) */}
                    {uploadForm.category === "customer_cars" && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium">{t("customer_car_details")}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <Label>{t("car_make")}</Label>
                            <Input
                              value={uploadForm.carMake}
                              onChange={(e) => setUploadForm(prev => ({ ...prev, carMake: e.target.value }))}
                              placeholder="Toyota"
                            />
                          </div>
                          <div>
                            <Label>{t("car_model")}</Label>
                            <Input
                              value={uploadForm.carModel}
                              onChange={(e) => setUploadForm(prev => ({ ...prev, carModel: e.target.value }))}
                              placeholder="Camry"
                            />
                          </div>
                          <div>
                            <Label>{t("year")}</Label>
                            <Input
                              value={uploadForm.carYear}
                              onChange={(e) => setUploadForm(prev => ({ ...prev, carYear: e.target.value }))}
                              placeholder="2020"
                            />
                          </div>
                          <div>
                            <Label>{t("plate_number")}</Label>
                            <Input
                              value={uploadForm.plateNumber}
                              onChange={(e) => setUploadForm(prev => ({ ...prev, plateNumber: e.target.value.toUpperCase() }))}
                              placeholder="ABC123"
                              className="font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1">
                        {t("upload_images")}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsUploadDialogOpen(false)}
                      >
                        {t("cancel")}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={image.imageUrl}
                    alt={image.title}
                    fill
                    className="object-cover"
                  />
                  {image.isFeatured && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500">
                      <Star className="h-3 w-3 mr-1" />
                      {t("featured")}
                    </Badge>
                  )}
                  {image.isBeforeAfter && (
                    <Badge className="absolute top-2 right-2 bg-green-500">
                      {t("before_after")}
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-sm line-clamp-1">{image.title}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          setSelectedImage(image);
                          setIsPreviewDialogOpen(true);
                        }}>
                          <Eye className="h-4 w-4 mr-2" />
                          {t("preview")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleFeatured(image.id)}>
                          <Star className="h-4 w-4 mr-2" />
                          {image.isFeatured ? t("unfeature") : t("feature")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteImage(image.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">{image.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="text-xs">
                      {t(image.category)}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {image.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {image.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {image.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{image.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        // List view would go here - similar structure but different layout
        <div className="space-y-4">
          {filteredImages.map((image) => (
            <Card key={image.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                    <Image
                      src={image.imageUrl}
                      alt={image.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{image.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{image.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary">{t(image.category)}</Badge>
                          {image.isFeatured && (
                            <Badge className="bg-yellow-500">
                              <Star className="h-3 w-3 mr-1" />
                              {t("featured")}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedImage(image);
                            setIsPreviewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteImage(image.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredImages.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || categoryFilter !== "all" ? t("no_images_found") : t("no_images_yet")}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || categoryFilter !== "all" 
                ? t("try_different_search") 
                : t("start_building_gallery")
              }
            </p>
            {(!searchTerm && categoryFilter === "all") && (
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t("upload_first_image")}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedImage.title}</DialogTitle>
                <DialogDescription>{selectedImage.description}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {selectedImage.isBeforeAfter && selectedImage.beforeImageUrl && selectedImage.afterImageUrl ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">{t("before")}</h4>
                      <div className="relative aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={selectedImage.beforeImageUrl}
                          alt={`${selectedImage.title} - Before`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">{t("after")}</h4>
                      <div className="relative aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={selectedImage.afterImageUrl}
                          alt={`${selectedImage.title} - After`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={selectedImage.imageUrl}
                      alt={selectedImage.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>{t("category")}:</strong> {t(selectedImage.category)}
                  </div>
                  <div>
                    <strong>{t("service_type")}:</strong> {selectedImage.serviceType ? t(selectedImage.serviceType) : t("not_specified")}
                  </div>
                  <div>
                    <strong>{t("created")}:</strong> {new Date(selectedImage.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>{t("featured")}:</strong> {selectedImage.isFeatured ? t("yes") : t("no")}
                  </div>
                </div>
                
                {selectedImage.tags.length > 0 && (
                  <div>
                    <strong className="text-sm">{t("tags")}:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedImage.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedImage.customerCar && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <strong className="text-sm">{t("customer_car")}:</strong>
                    <p className="mt-1">
                      {selectedImage.customerCar.year} {selectedImage.customerCar.make} {selectedImage.customerCar.model}
                      {selectedImage.customerCar.plateNumber && ` - ${selectedImage.customerCar.plateNumber}`}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}