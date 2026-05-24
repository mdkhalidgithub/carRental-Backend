import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import User from '../models/User.js';
import { sendBookingEmails, sendCancelBookingEmails } from '../utils/emailService.js';

// @desc    Get all bookings for a specific user ID
// @route   GET /api/bookings/user/:userId
// @access  Public (or Private)
export const getBookingsByUserId = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId }).populate('car');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get bookings for the logged-in user
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate('car')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
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

    // Send confirmation emails (don't block response on email)
    try {
      sendBookingEmails(booking, carExists, userDetails)
        .then(emailResult => console.log('Email sending result:', emailResult))
        .catch(emailError => console.error('Error sending emails:', emailError));
    } catch (emailError) {
      console.error('Error sending emails sync block:', emailError);
    }

    res.status(201).json({
      booking,
      message: 'Booking created successfully! Confirmation emails have been sent.'
    });
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(400).json({ message: err.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Fetch car and user details for email (don't block response on email)
    try {
      Promise.all([
        Car.findById(booking.car),
        User.findById(booking.user)
      ]).then(([car, user]) => {
        if (car && user) {
          sendCancelBookingEmails(booking, car, user)
            .then(emailResult => console.log('Cancellation email result:', emailResult))
            .catch(emailError => console.error('Error sending cancellation emails:', emailError));
        }
      });
    } catch (emailError) {
      console.error('Error processing cancellation emails:', emailError);
    }

    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
