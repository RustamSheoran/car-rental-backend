'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { CARS } from '@/lib/cars';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CarsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedCar, setSelectedCar] = useState<(typeof CARS)[0] | null>(null);
  const [days, setDays] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleBookClick = (car: (typeof CARS)[0]) => {
    if (!isAuthenticated) {
      toast.error('Please log in to book a car');
      router.push('/login');
      return;
    }
    setSelectedCar(car);
    setDays(1);
    setDialogOpen(true);
  };

  const handleBooking = async () => {
    if (!selectedCar) return;

    setIsBooking(true);
    try {
      await api.createBooking(selectedCar.name, days, selectedCar.price);
      toast.success('Booking created successfully!');
      setDialogOpen(false);
      router.push('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Booking failed');
    } finally {
      setIsBooking(false);
    }
  };

  const totalCost = selectedCar ? selectedCar.price * days : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Our Fleet
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Choose from our wide selection of premium vehicles</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CARS.map((car) => (
            <Card key={car.id} className="hover:shadow-xl transition-shadow overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">{car.image}</div>
                  <CardTitle className="text-xl">{car.name}</CardTitle>
                  <CardDescription className="mt-1">{car.type}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      ₹{car.price}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">per day</p>
                  </div>
                  <Badge variant="secondary">{car.type}</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{car.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {car.features.slice(0, 3).map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {car.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{car.features.length - 3} more
                    </Badge>
                  )}
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleBookClick(car)}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book {selectedCar?.name}</DialogTitle>
              <DialogDescription>
                Complete your booking for {selectedCar?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="text-5xl mb-2">{selectedCar?.image}</div>
                <p className="text-lg font-semibold">{selectedCar?.name}</p>
                <p className="text-sm text-gray-500">{selectedCar?.type}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="days">Number of Days</Label>
                <Input
                  id="days"
                  type="number"
                  min="1"
                  max="30"
                  value={days}
                  onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
              <div className="bg-indigo-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Price per day:</span>
                  <span className="font-semibold">₹{selectedCar?.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Duration:</span>
                  <span className="font-semibold">{days} day(s)</span>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-600 mt-2 pt-2">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold">Total Cost:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      ₹{totalCost}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDialogOpen(false)}
                  disabled={isBooking}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleBooking}
                  disabled={isBooking}
                >
                  {isBooking ? 'Booking...' : 'Confirm Booking'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
