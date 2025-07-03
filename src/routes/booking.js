import express from 'express';
import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import { sendBookingEmails, sendCancelBookingEmails } from '../utils/emailService.js';

const router = express.Router();

// Get all bookings for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId }).populate('car');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get bookings for current user
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate('car')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a booking
router.post('/', auth, async (req, res) => {
  try {
    const { 
      user, 
      car, 
      startDate, 
      endDate, 
      totalPrice, 
      pickupLocation, 
      returnLocation, 
      additionalServices, 
      mobileNumber 
    } = req.body;

    // Validate required fields
    if (!user || !car || !startDate || !endDate || !totalPrice || !mobileNumber) {
      return res.status(400).json({ 
        message: 'Missing required fields: user, car, startDate, endDate, totalPrice, mobileNumber' 
      });
    }

    // Check if car exists and is available
    const carExists = await Car.findById(car);
    if (!carExists) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (!carExists.available) {
      return res.status(400).json({ message: 'Car is not available for booking' });
    }

    // Get user details for email
    const userDetails = await User.findById(user);
    if (!userDetails) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create booking
    const booking = new Booking({ 
      user, 
      car, 
      startDate, 
      endDate, 
      totalPrice,
      pickupLocation,
      returnLocation,
      additionalServices,
      mobileNumber
    });
    
    await booking.save();

    // Send confirmation emails
    try {
      const emailResult = await sendBookingEmails(booking, carExists, userDetails);
      console.log('Email sending result:', emailResult);
      
      if (!emailResult.userEmailSent || !emailResult.adminEmailSent) {
        console.warn('Some emails failed to send, but booking was created successfully');
      }
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      // Don't fail the booking if email fails
    }

    // Optionally, set car as unavailable
    // await Car.findByIdAndUpdate(car, { available: false });

    res.status(201).json({
      booking,
      message: 'Booking created successfully! Confirmation emails have been sent.'
    });
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(400).json({ message: err.message });
  }
});

// Cancel a booking
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Fetch car and user details for email
    const car = await Car.findById(booking.car);
    const user = await User.findById(booking.user);
    if (car && user) {
      try {
        const emailResult = await sendCancelBookingEmails(booking, car, user);
        console.log('Cancellation email result:', emailResult);
        if (!emailResult.userEmailSent || !emailResult.adminEmailSent) {
          console.warn('Some cancellation emails failed to send, but booking was cancelled successfully');
        }
      } catch (emailError) {
        console.error('Error sending cancellation emails:', emailError);
      }
    }

    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router; 