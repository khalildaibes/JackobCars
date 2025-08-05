"use client";

import { useState, useEffect } from "react";
import { Calendar, Users, Clock, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  maxSimultaneousAppointments: number;
  appointmentDuration: number;
}

interface Appointment {
  id: string;
  storeId: string;
  storeName: string;
  customerName: string;
  customerPhone: string;
  selectedDate: string;
  selectedTime: string;
  serviceType: string;
  plateNumber: string;
  status: string;
}

export default function AdminAppointmentsPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [appointments, setAppointments] = useState<{ [storeId: string]: Appointment[] }>({});
  const [isLoading, setIsLoading] = useState(true);

  const storeIds = ['default', 'store1', 'store2'];

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load store configurations
        const storePromises = storeIds.map(async (storeId) => {
          const response = await fetch(`/api/stores?name=${storeId}`);
          if (response.ok) {
            return await response.json();
          }
          return null;
        });

        const storeResults = await Promise.all(storePromises);
        const validStores = storeResults.filter(store => store !== null);
        setStores(validStores);

        // Load appointments for each store
        const appointmentPromises = validStores.map(async (store: Store) => {
          const response = await fetch(`/api/appointments?store=${store.name}`);
          if (response.ok) {
            const data = await response.json();
            return { storeId: store.id, appointments: data.appointments || [] };
          }
          return { storeId: store.id, appointments: [] };
        });

        const appointmentResults = await Promise.all(appointmentPromises);
        const appointmentsByStore: { [storeId: string]: Appointment[] } = {};
        
        appointmentResults.forEach(result => {
          appointmentsByStore[result.storeId] = result.appointments;
        });

        setAppointments(appointmentsByStore);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-20 mb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Management</h1>
          <p className="text-gray-600">Manage appointments across all stores</p>
        </div>

        {/* Store Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stores.map((store) => (
            <Card key={store.id} className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  {store.name}
                </CardTitle>
                <CardDescription className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    {store.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    Max {store.maxSimultaneousAppointments} simultaneous appointments
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    {store.appointmentDuration} minutes per appointment
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Appointments:</span>
                    <span className="font-semibold text-blue-600">
                      {appointments[store.id]?.length || 0}
                    </span>
                  </div>
                  
                  <Link href={`/book-appointment?storeId=${store.id}`}>
                    <Button className="w-full" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Appointments by Store */}
        <div className="space-y-8">
          {stores.map((store) => (
            <Card key={store.id} className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  {store.name} - Appointments
                </CardTitle>
                <CardDescription>
                  Recent appointments for this store
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appointments[store.id]?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Customer</th>
                          <th className="text-left p-2">Phone</th>
                          <th className="text-left p-2">Date</th>
                          <th className="text-left p-2">Time</th>
                          <th className="text-left p-2">Service</th>
                          <th className="text-left p-2">Vehicle</th>
                          <th className="text-left p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments[store.id].map((appointment) => (
                          <tr key={appointment.id} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">{appointment.customerName}</td>
                            <td className="p-2">{appointment.customerPhone}</td>
                            <td className="p-2">{new Date(appointment.selectedDate).toLocaleDateString()}</td>
                            <td className="p-2">{appointment.selectedTime}</td>
                            <td className="p-2 capitalize">{appointment.serviceType.replace('_', ' ')}</td>
                            <td className="p-2 font-mono">{appointment.plateNumber}</td>
                            <td className="p-2">
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                {appointment.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No appointments yet for this store</p>
                    <Link href={`/book-appointment?storeId=${store.id}`}>
                      <Button className="mt-3" variant="outline" size="sm">
                        Create First Appointment
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Quick Actions</h3>
                <p className="text-blue-700 text-sm">Test the booking system with different stores</p>
              </div>
              <div className="flex gap-2">
                <Link href="/book-appointment?storeId=default">
                  <Button variant="outline" size="sm">Test Default Store</Button>
                </Link>
                <Link href="/book-appointment?storeId=store1">
                  <Button variant="outline" size="sm">Test Store 1</Button>
                </Link>
                <Link href="/book-appointment?storeId=store2">
                  <Button variant="outline" size="sm">Test Store 2</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}