'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api, Booking, BookingSummaryResponse } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Link from 'next/link';

export default function DashboardPage() {
  const { logout } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [summary, setSummary] = useState<{ totalBookings: number; totalAmountSpent: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadBookings();
    loadSummary();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await api.getBookings();
      if (response.success && Array.isArray(response.data)) {
        setBookings(response.data);
      }
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const response = await api.getBookingSummary() as BookingSummaryResponse;
      if (response.success && response.data) {
        setSummary({
          totalBookings: response.data.totalBookings,
          totalAmountSpent: response.data.totalAmountSpent,
        });
      }
    } catch (error) {
      console.error('Failed to load summary');
    }
  };

  const handleDelete = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await api.deleteBooking(bookingId);
      toast.success('Booking cancelled successfully');
      loadBookings();
      loadSummary();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleUpdate = async () => {
    if (!selectedBooking) return;

    setIsUpdating(true);
    try {
      await api.updateBooking(selectedBooking.id, { status: newStatus });
      toast.success('Booking updated successfully');
      setUpdateDialogOpen(false);
      loadBookings();
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <div className="flex gap-2">
            <Link href="/cars">
              <Button variant="outline">Browse Cars</Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline">Admin Panel</Button>
            </Link>
            <Button variant="destructive" onClick={logout}>
              Logout
            </Button>
          </div>
        </nav>

        {summary && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Total Bookings</CardTitle>
                <CardDescription>All time bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{summary.totalBookings}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Amount Spent</CardTitle>
                <CardDescription>Across all bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                  ₹{summary.totalAmountSpent.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Your Bookings</CardTitle>
            <CardDescription>View and manage your car rentals</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No bookings yet</p>
                <Link href="/cars">
                  <Button>Browse Cars</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Car</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Price/Day</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.car_name}</TableCell>
                        <TableCell>{booking.days}</TableCell>
                        <TableCell>₹{booking.rent_per_day}</TableCell>
                        <TableCell className="font-semibold">₹{booking.totalCost.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openUpdateDialog(booking)}
                            >
                              Update
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(booking.id)}
                              disabled={booking.status === 'cancelled'}
                            >
                              Cancel
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Booking</DialogTitle>
              <DialogDescription>
                Update status for {selectedBooking?.car_name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="booked">Booked</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setUpdateDialogOpen(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
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
