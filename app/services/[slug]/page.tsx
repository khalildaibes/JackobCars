"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Img } from "../../../components/Img";
import Link from "next/link";
import { 
  ChevronLeft, 
  Check, 
  Clock, 
  MapPin, 
  DollarSign, 
  Shield, 
  MessageSquare, 
  Heart, 
  Share2,
  ShoppingCart,
  Store
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { Card, CardContent } from "../../../components/ui/card";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useUserActivity } from "../../../context/UserActivityContext";

interface Service {
  id: string;
  slug: string;
  name: string;
  images?: Array<{ url: string }>;
  details: {
    description: string;
    duration: string;
    price: number;
    warranty: string;
    features: Array<{ value: string }>;
    requirements: Array<{ value: string }>;
  };
  categories: any;
  stores: Array<{ 
    id: string; 
    name: string;
    location: string;
    rating: number;
    reviews: number;
  }>;
  similarServices: Array<{
    id: string;
    name: string;
    images: Array<{ url: string }>;
    price: number;
  }>;
}


const ServiceDetails = () => {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const storehostname = searchParams.get('store_hostname');
  const [activeImage, setActiveImage] = useState(0);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [emailFormData, setEmailFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const t = useTranslations("ServiceDetails");

  const { data: serviceData, isLoading } = useQuery({
    queryKey: ["service", slug, storehostname],
    queryFn: async () => {
      const response = await fetch(`/api/services?slug=${slug}&store_hostname=${storehostname}`);
      if (!response.ok) throw new Error('Service not found');
      const data = await response.json();
      console.log('Response:', data);
      return data;
    },
  });

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement email sending logic here
    setIsEmailDialogOpen(false);
    toast.success('Message sent successfully!');
  };
  const { logActivity } = useUserActivity();

  useEffect(() => {
    logActivity("service_view", { id: serviceData.data[0].id, title: serviceData.data[0].name });
  }, [serviceData.data[0].id]);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!serviceData?.data?.[0]) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Service not found</h1>
          <p className="text-gray-600 mt-2">The service you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const currentService = serviceData.data[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 bg-white mt-[10%] md:mt-[5%]"
    >
      {/* Back Button */}
      <Link
        href="/services"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Services
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div 
            className="relative rounded-lg overflow-hidden cursor-zoom-in bg-gray-100"
            onClick={() => setIsImageViewerOpen(true)}
          >
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <Img
                src={`http://${storehostname}${currentService.image.url || '/default-service.png'}`}
                alt={currentService.name}
                width={800}
                height={800}
                external={true}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          </div>
          {currentService.image && currentService.image.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {currentService.image.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                    activeImage === index ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Img
                      src={`http://${storehostname}${img.url}`}
                      alt={`${currentService.name} view ${index + 1}`}
                      width={200}
                      height={200}
                      external={true}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Service Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentService.title}</h1>
            <div className="flex items-center gap-2">
              {currentService.categories && currentService.categories?.map((category, index) => (
                <Badge key={index} variant="secondary">
                  {category.name.trim()}
                </Badge>
              ))}
            </div>
          </div>

          <div className="text-3xl font-bold text-blue-600">
            {currentService.price.toLocaleString()}
          </div>

          <div className="flex gap-4">
            <Button className="flex-1" size="lg">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Book Now
            </Button>
            <Button variant="outline" className="flex-1" size="lg" onClick={() => setIsEmailDialogOpen(true)}>
              <MessageSquare className="w-5 h-5 mr-2" />
              Contact Store
            </Button>
          </div>

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-4">
              <div className="space-y-4">
                <p className="text-gray-600 whitespace-pre-line">{currentService.description}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span>{currentService.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-gray-500" />
                    <span>{currentService.warranty}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="mt-4">
              <div className="space-y-4">
                {currentService.details && currentService.details.features && currentService.details.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{feature.value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="mt-4">
              <div className="space-y-4">
                {currentService.details && currentService.details.requirements && currentService.details.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{requirement.value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Stores Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Available at</h3>
            <div className="space-y-4">
              {currentService.stores.map((store) => (
                <Card key={store.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Store className="w-5 h-5 text-gray-500" />
                        <div>
                          <h4 className="font-medium">{store.name}</h4>
                          <p className="text-sm text-gray-500">{store.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{store.rating}</span>
                          <span className="text-sm text-gray-500">({store.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Services Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Similar Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentService.similarServices && currentService.similarServices.map((similarService) => (
            <Card key={similarService.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <Img
                  src={`http://${storehostname}${similarService.image?.url || '/default-service.png'}`}
                  alt={similarService.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{similarService.name}</h3>
                <p className="text-lg font-bold text-blue-600 mt-2">
                  {similarService.price.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Image Viewer Dialog */}
      <Dialog open={isImageViewerOpen} onOpenChange={setIsImageViewerOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="max-w-full max-h-full p-4">
                <Img
                  src={`http://${storehostname}${currentService.image[activeImage]?.url || '/default-service.png'}`}
                  alt={currentService.name}
                  width={1920}
                  height={1080}
                  external={true}
                  className="max-w-full max-h-[80vh] object-contain"
                />
              </div>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {currentService.images && currentService.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-3 h-3 rounded-full ${
                    activeImage === index ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Store</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                name="name"
                value={emailFormData.name}
                onChange={handleEmailInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input
                name="phone"
                value={emailFormData.phone}
                onChange={handleEmailInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <Textarea
                name="message"
                value={emailFormData.message}
                onChange={handleEmailInputChange}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Toaster />
    </motion.div>
  );
};

export default ServiceDetails; 