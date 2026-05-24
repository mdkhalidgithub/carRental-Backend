import express from 'express';
import { 
  getAllCars, 
  getCarById, 
  createCar, 
  updateCar, 
  deleteCar 
} from '../controllers/carController.js';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all cars
router.get('/', getAllCars);

// Get car by ID
router.get('/:id', getCarById);

// Create car (admin only)
router.post('/', auth, isAdmin, createCar);

// Update car (admin only)
router.put('/:id', auth, isAdmin, updateCar);

// Delete car (admin only)
router.delete('/:id', auth, isAdmin, deleteCar);

export default router;