"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Car,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  MoreHorizontal
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";

interface Store {
  id: string;
  name: string;
  maxSimultaneousAppointments: number;
  workingHours: { start: string; end: string };
  workingDays: number[];
  appointmentDuration: number;
}

interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  carMake: string;
  carModel: string;
  plateNumber: string;
  serviceType: string;
  selectedDate: string;
  selectedTime: string;
  status: "confirmed" | "completed" | "cancelled" | "no_show";
  notes?: string;
  createdAt: string;
}

interface AppointmentManagementProps {
  storeId: string;
  store: Store;
}

export default function AppointmentManagement({ storeId, store }: AppointmentManagementProps) {
  const t = useTranslations("Dashboard");
  const { toast } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isBlockTimeOpen, setIsBlockTimeOpen] = useState(false);
  const [blockDate, setBlockDate] = useState("");
  const [blockStartTime, setBlockStartTime] = useState("");
  const [blockEndTime, setBlockEndTime] = useState("");
  const [blockReason, setBlockReason] = useState("");

  // Load appointments
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const response = await fetch(`/api/appointments?storeId=${storeId}`);
        if (response.ok) {
          const data = await response.json();
          setAppointments(data.appointments || []);
        }
      } catch (error) {
        console.error("Error loading appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, [storeId]);

  // Filter appointments
  useEffect(() => {
    let filtered = appointments;

    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.customerPhone.includes(searchTerm)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    if (selectedDate) {
      filtered = filtered.filter((apt) =>{
        console.log(`apt.selectedDate: ${apt.selectedDate} ${selectedDate}`);
        return new Date(apt.selectedDate).toLocaleDateString('en-US', {
          hour12: false,
          timeZone: "Asia/Jerusalem"
        }) === new Date(selectedDate).toLocaleDateString('en-US', {
          hour12: false,
          timeZone: "Asia/Jerusalem"
        });
      });
      console.log(`selectedDate: ${selectedDate} ${filtered.length}`);
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, statusFilter, selectedDate]);

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === appointmentId ? { ...apt, status: newStatus as any } : apt
          )
        );
        toast({
          title: t("appointment_updated"),
          description: t("appointment_status_updated"),
        });
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failed_to_update_appointment"),
        variant: "destructive",
      });
    }
  };

  const blockTimeSlot = async () => {
    try {
      const response = await fetch(`/api/appointments/block-time`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          date: blockDate,
          startTime: blockStartTime,
          endTime: blockEndTime,
          reason: blockReason,
        }),
      });

      if (response.ok) {
        toast({
          title: t("time_blocked"),
          description: t("time_slot_blocked_successfully"),
        });
        setIsBlockTimeOpen(false);
        setBlockDate("");
        setBlockStartTime("");
        setBlockEndTime("");
        setBlockReason("");
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failed_to_block_time"),
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    return <Badge variant="default">{status}</Badge>;
    const statusConfig = {
      confirmed: { label: t("confirmed"), variant: "default" as const },
      completed: { label: t("completed"), variant: "secondary" as const },
      cancelled: { label: t("cancelled"), variant: "destructive" as const },
      no_show: { label: t("no_show"), variant: "outline" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTodayAppointments = () => {
    const today = new Date().toLocaleDateString('en-US', {
      hour12: false,
      timeZone: "Asia/Jerusalem"
    });
    return appointments.filter((apt) => new Date(apt.selectedDate).toLocaleDateString('en-US', {
      hour12: false,
      timeZone: "Asia/Jerusalem"
    }) === today);
  };

  const getUpcomingAppointments = () => {
    const today = new Date().toLocaleDateString('en-US', {
      hour12: false,
      timeZone: "Asia/Jerusalem"
    });
    return appointments.filter((apt) => new Date(apt.selectedDate) > new Date(today));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{t("appointment_management")}</h2>
          <p className="text-gray-600">{t("manage_store_appointments")}</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isBlockTimeOpen} onOpenChange={setIsBlockTimeOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <XCircle className="h-4 w-4 mr-2" />
                {t("block_time")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("block_time_slot")}</DialogTitle>
                <DialogDescription>
                  {t("block_time_slot_desc")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{t("date")}</Label>
                  <Input
                    type="date"
                    value={blockDate}
                    onChange={(e) => setBlockDate(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t("start_time")}</Label>
                    <Input
                      type="time"
                      value={blockStartTime}
                      onChange={(e) => setBlockStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>{t("end_time")}</Label>
                    <Input
                      type="time"
                      value={blockEndTime}
                      onChange={(e) => setBlockEndTime(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>{t("reason")}</Label>
                  <Textarea
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder={t("block_reason_placeholder")}
                  />
                </div>
                <Button onClick={blockTimeSlot} className="w-full">
                  {t("block_time_slot")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>{t("search")}</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t("search_appointments")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label>{t("status")}</Label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">{t("all_statuses")}</option>
                <option value="confirmed">{t("confirmed")}</option>
                <option value="completed">{t("completed")}</option>
                <option value="cancelled">{t("cancelled")}</option>
                <option value="no_show">{t("no_show")}</option>
              </select>
            </div>
            
            <div>
              <Label>{t("date")}</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setSelectedDate("");
                }}
              >
                {t("clear_filters")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">{t("all_appointments")} ({filteredAppointments.length})</TabsTrigger>
          <TabsTrigger value="today">{t("today")} ({getTodayAppointments().length})</TabsTrigger>
          <TabsTrigger value="upcoming">{t("upcoming")} ({getUpcomingAppointments().length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <AppointmentsList 
            appointments={filteredAppointments} 
            onStatusUpdate={updateAppointmentStatus}
            getStatusBadge={getStatusBadge}
            t={t}
          />
        </TabsContent>

        <TabsContent value="today">
          <AppointmentsList 
            appointments={getTodayAppointments()} 
            onStatusUpdate={updateAppointmentStatus}
            getStatusBadge={getStatusBadge}
            t={t}
          />
        </TabsContent>

        <TabsContent value="upcoming">
          <AppointmentsList 
            appointments={getUpcomingAppointments()} 
            onStatusUpdate={updateAppointmentStatus}
            getStatusBadge={getStatusBadge}
            t={t}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Appointments List Component
interface AppointmentsListProps {
  appointments: Appointment[];
  onStatusUpdate: (id: string, status: string) => void;
  getStatusBadge: (status: string) => JSX.Element;
  t: any;
}

function AppointmentsList({ appointments, onStatusUpdate, getStatusBadge, t }: AppointmentsListProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("no_appointments")}</h3>
          <p className="text-gray-600">{t("no_appointments_desc")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <motion.div
          key={appointment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold">{appointment.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-3 w-3" />
                      <span>{appointment.customerPhone}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{new Date(appointment.selectedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-3 w-3" />
                        <span>{appointment.selectedTime}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Car className="h-4 w-4 text-gray-500" />
                      <span>{appointment.carMake} {appointment.carModel}</span>
                    </div>
                    <div className="text-sm text-gray-600 font-mono">
                      {appointment.plateNumber}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2">
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      {appointment.serviceType.replace('_', ' ')}
                    </div>
                  </div>
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
                    <DropdownMenuItem
                      onClick={() => onStatusUpdate(appointment.id, "completed")}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t("mark_completed")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusUpdate(appointment.id, "cancelled")}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {t("cancel_appointment")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusUpdate(appointment.id, "no_show")}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t("mark_no_show")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {appointment.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{appointment.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}