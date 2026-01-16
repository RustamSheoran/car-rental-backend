const prisma = require('../config/prisma');
const { validateBookingInput, validateBookingUpdate } = require('../utils/validators');

const createBooking = async (req, res) => {
  try {
    const { carName, days, rentPerDay } = req.body;
    const userId = req.user.userId;

    const validation = validateBookingInput(carName, days, rentPerDay);
    if (!validation.valid) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    const totalCost = days * rentPerDay;

    const booking = await prisma.booking.create({
      data: {
        user_id: userId,
        car_name: carName.trim(),
        days,
        rent_per_day: rentPerDay,
        status: 'booked'
      }
    });

    return res.status(201).json({
      success: true,
      data: {
        message: 'Booking created successfully',
        bookingId: booking.id,
        totalCost
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

const getBookings = async (req, res) => {
  try {
    const { bookingId, summary } = req.query;
    const userId = req.user.userId;
    const username = req.user.username;

    if (summary === 'true') {
      const bookings = await prisma.booking.findMany({
        where: {
          user_id: userId,
          status: {
            in: ['booked', 'completed']
          }
        }
      });

      const totalBookings = bookings.length;
      const totalAmountSpent = bookings.reduce((sum, booking) => {
        return sum + (booking.days * booking.rent_per_day);
      }, 0);

      return res.status(200).json({
        success: true,
        data: {
          userId,
          username,
          totalBookings,
          totalAmountSpent
        }
      });
    }

    if (bookingId) {
      const booking = await prisma.booking.findFirst({
        where: {
          id: parseInt(bookingId),
          user_id: userId
        }
      });

      if (!booking) {
        return res.status(404).json({ success: false, error: 'Booking not found' });
      }

      const totalCost = booking.days * booking.rent_per_day;

      return res.status(200).json({
        success: true,
        data: [
          {
            id: booking.id,
            car_name: booking.car_name,
            days: booking.days,
            rent_per_day: booking.rent_per_day,
            status: booking.status,
            totalCost
          }
        ]
      });
    }

    const bookings = await prisma.booking.findMany({
      where: { user_id: userId }
    });

    const bookingsWithTotalCost = bookings.map(booking => ({
      id: booking.id,
      car_name: booking.car_name,
      days: booking.days,
      rent_per_day: booking.rent_per_day,
      status: booking.status,
      totalCost: booking.days * booking.rent_per_day
    }));

    return res.status(200).json({
      success: true,
      data: bookingsWithTotalCost
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

const updateBooking = async (req, res) => {
  try {
    const bookingId = parseInt(req.params.bookingId);
    const userId = req.user.userId;
    const { carName, days, rentPerDay, status } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    if (booking.user_id !== userId) {
      return res.status(403).json({ success: false, error: 'Booking does not belong to user' });
    }

    const validation = validateBookingUpdate(carName, days, rentPerDay, status);
    if (!validation.valid) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    const updateData = {};
    if (carName !== undefined) updateData.car_name = carName.trim();
    if (days !== undefined) updateData.days = days;
    if (rentPerDay !== undefined) updateData.rent_per_day = rentPerDay;
    if (status !== undefined) updateData.status = status;

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData
    });

    const totalCost = updatedBooking.days * updatedBooking.rent_per_day;

    return res.status(200).json({
      success: true,
      data: {
        message: 'Booking updated successfully',
        booking: {
          id: updatedBooking.id,
          car_name: updatedBooking.car_name,
          days: updatedBooking.days,
          rent_per_day: updatedBooking.rent_per_day,
          status: updatedBooking.status,
          totalCost
        }
      }
    });
  } catch (error) {
    console.error('Update booking error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const bookingId = parseInt(req.params.bookingId);
    const userId = req.user.userId;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    if (booking.user_id !== userId) {
      return res.status(403).json({ success: false, error: 'Booking does not belong to user' });
    }

    await prisma.booking.delete({
      where: { id: bookingId }
    });

    return res.status(200).json({
      success: true,
      data: {
        message: 'Booking deleted successfully'
      }
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking
};
