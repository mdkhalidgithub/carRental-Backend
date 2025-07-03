import express from 'express';
import Car from '../models/Car.js';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all cars
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find();
    console.log(cars);
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get car by ID
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create car (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update car (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete car (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json({ message: 'Car deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router; 