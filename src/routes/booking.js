import express from 'express';
import { 
  getBookingsByUserId, 
  getMyBookings, 
  createBooking, 
  cancelBooking 
} from '../controllers/bookingController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get bookings for current user (specific route, must be defined before generic /:id routes if any)
router.get('/my-bookings', auth, getMyBookings);

// Get all bookings for a user by user ID
router.get('/user/:userId', getBookingsByUserId);

// Create a booking
router.post('/', auth, createBooking);

// Cancel a booking
router.put('/:id/cancel', auth, cancelBooking);

export default router;