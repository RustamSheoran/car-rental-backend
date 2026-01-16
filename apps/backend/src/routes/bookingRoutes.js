const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking
} = require('../controllers/bookingController');

router.use(authMiddleware);

router.post('/', createBooking);
router.get('/', getBookings);
router.put('/:bookingId', updateBooking);
router.delete('/:bookingId', deleteBooking);

module.exports = router;
