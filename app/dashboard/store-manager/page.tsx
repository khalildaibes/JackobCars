"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { 
  Calendar, 
  Package, 
  Settings, 
  Camera, 
  Users, 
  Clock, 
  BarChart3,
  Bell,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Badge } from "../../../components/ui/badge";
import AppointmentManagement from "../../../components/dashboard/AppointmentManagement";
import ProductServiceManagement from "../../../components/dashboard/ProductServiceManagement";
import WorkGalleryManagement from "../../../components/dashboard/WorkGalleryManagement";
import StoreSettingsManagement from "../../../components/dashboard/StoreSettingsManagement";

interface Store {
  additional: any;
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  maxSimultaneousAppointments: number;
  workingHours: {
    start: string;
    end: string;
  };
  workingDays: number[];
  appointmentDuration: number;
}

interface DashboardStats {
  todayAppointments: number;
  weekAppointments: number;
  monthRevenue: number;
  totalServices: number;
  pendingAppointments: number;
  completedToday: number;
}

export default function StoreManagerDashboard() {
  const searchParams = useSearchParams();
  let storeId = searchParams.get("storeId") || "default";
  if (storeId === 'default') {
    storeId = 'ASD Auto Spa Detailing';
  }
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const isRTL = locale === 'ar' || locale === 'he-IL';
  const [store, setStore] = useState<Store | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    todayAppointments: 0,
    weekAppointments: 0,
    monthRevenue: 0,
    totalServices: 0,
    pendingAppointments: 0,
    completedToday: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock authentication - in production, this should use proper auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<"store_manager" | "admin" | null>(null);

  useEffect(() => {
    // Mock authentication check
    const checkAuth = () => {
      // In production, this should verify JWT token or session
      const mockAuth = localStorage.getItem("store_manager_auth");
      if (mockAuth) {
        setIsAuthenticated(true);
        setUserRole("store_manager");
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const loadStoreData = async () => {
      if (!isAuthenticated) return;

      try {
        // Load store information
        const storeResponse = await fetch(`/api/stores?name=${storeId}`);
        console.log('Store Response:', storeResponse);
        if (storeResponse.ok) {
          const storeJson = await storeResponse.json();
          const storeData = storeJson.data[0] || storeJson;
          setStore(storeData);
        }

        // Load dashboard statistics
        const statsResponse = await fetch(`/api/dashboard/stats?storeId=${storeId==='default' ? 'ASD Auto Spa Detailing' : storeId}`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      } catch (error) {
        console.error("Error loading store data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoreData();
  }, [storeId, isAuthenticated]);

  // Mock login function
  const handleLogin = () => {
    localStorage.setItem("store_manager_auth", "true");
    setIsAuthenticated(true);
    setUserRole("store_manager");
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("store_manager_auth");
    setIsAuthenticated(false);
    setUserRole(null);
  };
  console.log("store id", store);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t('login_required')}</CardTitle>
            <CardDescription>
              {t('login_required_desc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleLogin} className="w-full">
              {t('login_as_store_manager')}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              {t('demo_login_note')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('store_not_found')}</h2>
            <p className="text-gray-600">{t('store_not_found_desc')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-20 mb-20" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('store_manager_dashboard')}
            </h1>
            <p className="text-gray-600 mb-4">{store.name}</p>
            
            {/* Store Info Quick View */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{store.address}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>{store.phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>{store.email}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {userRole?.replace('_', ' ')}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              {t('logout')}
            </Button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t('overview')}
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t('appointments')}
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              {t('products_services')}
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              {t('work_gallery')}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {t('store_settings')}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('today_appointments')}</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.todayAppointments}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.completedToday} {t('completed')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('week_appointments')}</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.weekAppointments}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% {t('from_last_week')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('pending_appointments')}</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingAppointments}</div>
                  <p className="text-xs text-muted-foreground">
                    {t('require_attention')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('total_services')}</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalServices}</div>
                  <p className="text-xs text-muted-foreground">
                    {t('active_services')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('store_capacity')}</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{store.maxSimultaneousAppointments || 1}</div>
                  <p className="text-xs text-muted-foreground">
                    {t('max_simultaneous')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('working_hours')}</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {store.additional.working_hours.friday.open} - {store.additional.working_hours.friday.close}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {store.appointmentDuration} {t('min_per_appointment')}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('quick_actions')}</CardTitle>
                <CardDescription>{t('quick_actions_desc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2"
                    onClick={() => setActiveTab("appointments")}
                  >
                    <Calendar className="h-6 w-6" />
                    <span className="text-sm">{t('manage_calendar')}</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2"
                    onClick={() => setActiveTab("products")}
                  >
                    <Package className="h-6 w-6" />
                    <span className="text-sm">{t('add_service')}</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2"
                    onClick={() => setActiveTab("gallery")}
                  >
                    <Camera className="h-6 w-6" />
                    <span className="text-sm">{t('upload_images')}</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="h-6 w-6" />
                    <span className="text-sm">{t('store_settings')}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Management Tab */}
          <TabsContent value="appointments">
            <AppointmentManagement storeId={storeId==='default' ? 'ASD Auto Spa Detailing' : storeId} store={store} />
          </TabsContent>

          {/* Products & Services Management Tab */}
          <TabsContent value="products">
            <ProductServiceManagement storeId={storeId==='default' ? 'ASD Auto Spa Detailing' : storeId} store={store} />
          </TabsContent>

          {/* Work Gallery Management Tab */}
          <TabsContent value="gallery">
            <WorkGalleryManagement storeId={storeId==='default' ? 'ASD Auto Spa Detailing' : storeId} store={store} />
          </TabsContent>

          {/* Store Settings Management Tab */}
          <TabsContent value="settings">
            <StoreSettingsManagement
              storeId={storeId}
              store={store}
              onStoreUpdate={(updatedStore: Store) => setStore(updatedStore)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}