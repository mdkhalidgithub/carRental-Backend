import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  pickupLocation: { type: String },
  returnLocation: { type: String },
  additionalServices: [{ type: String }],
  status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' },
  mobileNumber: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema); 