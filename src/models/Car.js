import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  image: { type: String },
  available: { type: Boolean, default: true },
  description: { type: String },
  features: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Car', carSchema); 