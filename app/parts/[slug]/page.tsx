"use client";

import { useState, useEffect } from "react";
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
import emailjs from 'emailjs-com';

// Initialize EmailJS
emailjs.init("XNc8KcHCQwchLLHG5");

interface Part {
  id: string;
  slug: string;
  name: string;
  title?: string;
  images?: Array<{ url: string }>;
  details: {
    description: string;
    features: Array<{ value: string }>;
    specifications: Array<{ key: string; value: string }>;
    warranty: string;
    compatibility: Array<{ make: string; model: string; year: string }>;
  };
  price: number;
  categories: string;
  stores: Array<{ 
    id: string; 
    name: string;
    location: string;
    rating: number;
    reviews: number;
  }>;
  similarParts: Array<{
    id: string;
    name: string;
    images: Array<{ url: string }>;
    price: number;
  }>;
}

const PartDetails = () => {
  let { slug } = useParams();
  const searchParams = useSearchParams();
  const storehostname = searchParams.get('storehostname');
  slug = searchParams.get('slug');
  const [activeImage, setActiveImage] = useState(0);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [emailFormData, setEmailFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const t = useTranslations("PartDetails");
  console.log(`slug ${slug}`);
  console.log(`storehostname ${storehostname}`);

  // Add useEffect to initialize EmailJS
  useEffect(() => {
    emailjs.init("XNc8KcHCQwchLLHG5");
  }, []);

  const { data: partData, isLoading } = useQuery({
    queryKey: ["part", slug, storehostname],
    queryFn: async () => {
      const response = await fetch(`/api/parts?slug=${slug}&store_hostname=${storehostname}`);
      if (!response.ok) throw new Error('Part not found');
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
    try {
      const templateParams = {
        title: `Part Request for ${partData.data[0]?.title}`,
        name: emailFormData.name,
        phone: emailFormData.phone,
        time: new Date().toLocaleString(),
        message: emailFormData.message,
        email: "blacklife4ever93@gmail.com"
      };

      const result = await emailjs.send(
        'service_fiv09zs',
        'template_o7riedx',
        templateParams,
        'XNc8KcHCQwchLLHG5'
      );

      if (result.status === 200) {
        setIsEmailDialogOpen(false);
        toast.success('Message sent successfully!');
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!partData?.data?.[0]) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Part not found</h1>
          <p className="text-gray-600 mt-2">The part you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const currentPart = partData.data[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Back Button */}
      <Link
        href="/parts"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Parts
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg mt-[5%] md:mt-[15%]">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div 
            className="relative rounded-lg overflow-hidden cursor-zoom-in bg-gray-100"
            onClick={() => setIsImageViewerOpen(true)}
          >
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <Img
                src={`http://${storehostname}${currentPart.images?.[activeImage]?.url || '/default-part.png'}`}
                alt={currentPart.name}
                width={800}
                height={800}
                external={true}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          </div>
          {currentPart.images && currentPart.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {currentPart.images.map((img, index) => (
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
                      alt={`${currentPart.name} view ${index + 1}`}
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

        {/* Part Details */}
        <div className="space-y-6 ">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentPart.title}</h1>
            <div className="flex items-center gap-2">
              {currentPart.categories.map((category, index) => (
                <Badge key={index} variant="secondary">
                  {category.name.trim()}
                </Badge>
              ))}
            </div>
          </div>

          <div className="text-3xl font-bold text-blue-600">
            ${currentPart.price.toLocaleString()}
          </div>

          <div className="flex gap-4 ">
            <Button className="flex-1" size="lg">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" className="flex-1" size="lg" onClick={() => setIsEmailDialogOpen(true)}>
              <MessageSquare className="w-5 h-5 mr-2" />
              Contact Store
            </Button>
          </div>

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-4">
              <div className="space-y-4">
                <p className="text-gray-600 whitespace-pre-line">{currentPart.details?.description}</p>
                {currentPart.details?.features && currentPart.details?.features.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Features</h3>
                    <ul className="space-y-2">
                      {currentPart.details?.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-500" />
                          <span>{feature.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-4">
              <div className="space-y-4">
                {currentPart.details && currentPart.details?.specifications && currentPart.details?.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">{spec.key}</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="compatibility" className="mt-4">
              <div className="space-y-4">
                {currentPart.details && currentPart.details?.compatibility && currentPart.details?.compatibility.map((comp, index) => (
                  <div key={index} className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">{comp.make} {comp.model}</span>
                    <span className="font-medium">{comp.year}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Stores Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Available at</h3>
            <div className="space-y-4">
              {currentPart.stores.map((store) => (
                <Card key={store.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Store className="w-5 h-5 text-gray-500" />
                        <div>
                          <h4 className="font-medium">{store.name}</h4>
                          <p className="text-sm text-gray-500">{store?.location}</p>
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

      {/* Similar Parts Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Similar Parts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentPart.similarParts && currentPart.similarParts.map((similarPart) => (
            <Card key={similarPart.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <Img
                  src={`http://${storehostname}${similarPart.images[0]?.url || '/default-part.png'}`}
                  alt={similarPart.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{similarPart.name}</h3>
                <p className="text-lg font-bold text-blue-600 mt-2">
                  ${similarPart.price.toLocaleString()}
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
                  src={`http://${storehostname}${currentPart.images?.[activeImage]?.url || '/default-part.png'}`}
                  alt={currentPart.name}
                  width={1920}
                  height={1080}
                  external={true}
                  className="max-w-full max-h-[80vh] object-contain"
                />
              </div>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {currentPart.images && currentPart.images.map((_, index) => (
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
        <DialogContent className="bg-white p-4 rounded-lg">
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

export default PartDetails; 