'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api, Booking } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AdminPage() {
  const { isAuthenticated } = useAuth();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadAllBookings = async () => {
    if (!isAdminMode) return;
    
    setIsLoading(true);
    try {
      const response = await api.getBookings();
      if (response.success && Array.isArray(response.data)) {
        setAllBookings(response.data);
      }
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminMode) {
      loadAllBookings();
    } else {
      setAllBookings([]);
    }
  }, [isAdminMode]);

  const handleUpdate = async () => {
    if (!selectedBooking) return;

    setIsUpdating(true);
    try {
      await api.updateBooking(selectedBooking.id, { status: newStatus });
      toast.success('Booking updated successfully');
      setUpdateDialogOpen(false);
      loadAllBookings();
    } catch (error) {
      toast.error('Failed to update booking');
    } finally {
      setIsUpdating(false);
    }
  };

  const openUpdateDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setUpdateDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'booked':
        return <Badge className="bg-blue-500">Booked</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-purple-200">Manage all bookings and system operations</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard">
              <Button variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/20">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </nav>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/30 mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Admin Mode</CardTitle>
                <CardDescription className="text-purple-200">
                  Enable admin mode to view and manage all bookings
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="admin-mode" className="text-white cursor-pointer">
                  {isAdminMode ? 'Enabled' : 'Disabled'}
                </Label>
                <Switch
                  id="admin-mode"
                  checked={isAdminMode}
                  onCheckedChange={setIsAdminMode}
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>
            </div>
          </CardHeader>
        </Card>

        {isAdminMode && (
          <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">All Bookings</CardTitle>
              <CardDescription className="text-purple-200">
                View and manage bookings from all users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-purple-200">Loading bookings...</p>
                </div>
              ) : allBookings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-purple-200 mb-4">No bookings found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-purple-500/30">
                        <TableHead className="text-purple-200">Booking ID</TableHead>
                        <TableHead className="text-purple-200">Car</TableHead>
                        <TableHead className="text-purple-200">Days</TableHead>
                        <TableHead className="text-purple-200">Price/Day</TableHead>
                        <TableHead className="text-purple-200">Total</TableHead>
                        <TableHead className="text-purple-200">Status</TableHead>
                        <TableHead className="text-purple-200">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allBookings.map((booking) => (
                        <TableRow key={booking.id} className="border-purple-500/30">
                          <TableCell className="text-white font-medium">#{booking.id}</TableCell>
                          <TableCell className="text-white">{booking.car_name}</TableCell>
                          <TableCell className="text-white">{booking.days}</TableCell>
                          <TableCell className="text-white">₹{booking.rent_per_day}</TableCell>
                          <TableCell className="text-white font-semibold">₹{booking.totalCost.toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-purple-500 text-purple-300 hover:bg-purple-500/20"
                              onClick={() => openUpdateDialog(booking)}
                            >
                              Update Status
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {!isAdminMode && (
          <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/30">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-2xl font-bold text-white mb-2">Admin Mode Disabled</h3>
                <p className="text-purple-200 mb-6">
                  Enable admin mode using the toggle above to access booking management features
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
          <DialogContent className="bg-slate-800 border-purple-500/30">
            <DialogHeader>
              <DialogTitle className="text-white">Update Booking Status</DialogTitle>
              <DialogDescription className="text-purple-200">
                Update status for booking #{selectedBooking?.id} - {selectedBooking?.car_name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-white">Status</Label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-500/30 rounded-md bg-slate-700 text-white"
                >
                  <option value="booked">Booked</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-purple-500 text-purple-300 hover:bg-purple-500/20"
                  onClick={() => setUpdateDialogOpen(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  onClick={handleUpdate}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
