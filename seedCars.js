import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from './src/models/Car.js';

dotenv.config();

const cars = [
  {
    name: "Scorpio N",
    brand: "Mahindra",
    model: "Scorpio N",
    year: 2023,
    pricePerDay: 120,
    image: "/src/assets/car/scorpio.png",
    available: true,
    description: "Powerful SUV with excellent off-road capabilities. Perfect for adventure trips and family outings.",
    features: ["4x4", "Diesel Engine", "7 Seater", "Climate Control", "Touchscreen Infotainment"]
  },
  {
    name: "X5",
    brand: "BMW",
    model: "X5",
    year: 2023,
    pricePerDay: 200,
    image: "/src/assets/car/bmw.jpg",
    available: true,
    description: "Luxury SUV with premium features and powerful performance. Ideal for business and luxury travel.",
    features: ["xDrive AWD", "TwinPower Turbo", "5 Seater", "Panoramic Sunroof", "Premium Sound System"]
  },
  {
    name: "GLC",
    brand: "Mercedes-Benz",
    model: "GLC",
    year: 2023,
    pricePerDay: 180,
    image: "/src/assets/car/mercedes.png",
    available: true,
    description: "Elegant luxury SUV with sophisticated design and advanced technology features.",
    features: ["4MATIC AWD", "Turbo Engine", "5 Seater", "MBUX System", "Ambient Lighting"]
  },
  {
    name: "Nexon",
    brand: "Tata",
    model: "Nexon",
    year: 2023,
    pricePerDay: 80,
    image: "/src/assets/car/tatanexon.jpg",
    available: true,
    description: "Electric SUV with impressive range and modern features. Eco-friendly and cost-effective.",
    features: ["Electric Motor", "Long Range", "5 Seater", "Connected Car Tech", "Fast Charging"]
  },
  {
    name: "Harrier",
    brand: "Tata",
    model: "Harrier",
    year: 2023,
    pricePerDay: 100,
    image: "/src/assets/car/jeep.png",
    available: true,
    description: "Premium SUV with bold design and advanced safety features. Perfect for urban and highway driving.",
    features: ["Kryotec Engine", "5 Seater", "Advanced Safety", "Infotainment System", "Climate Control"]
  },
  {
    name: "3 Series",
    brand: "BMW",
    model: "3 Series",
    year: 2023,
    pricePerDay: 150,
    image: "/src/assets/car/tatanexon.jpg",
    available: true,
    description: "Sporty luxury sedan with dynamic performance and premium interior. Perfect for business and pleasure.",
    features: ["TwinPower Turbo", "RWD/AWD", "5 Seater", "iDrive System", "Sport Seats"]
  },
  {
    name: "C-Class",
    brand: "Mercedes-Benz",
    model: "C-Class",
    year: 2023,
    pricePerDay: 160,
    image: "/src/assets/car/mercedes.png",
    available: true,
    description: "Elegant luxury sedan with sophisticated design and cutting-edge technology.",
    features: ["Turbo Engine", "9G-TRONIC", "5 Seater", "MBUX System", "Premium Interior"]
  },
  {
    name: "Punch",
    brand: "Tata",
    model: "Punch",
    year: 2023,
    pricePerDay: 60,
    image: "/src/assets/car/tatanexon.jpg",
    available: true,
    description: "Compact SUV with modern design and practical features. Great for city driving and small families.",
    features: ["Revotron Engine", "5 Seater", "iRA Connected Car", "Safety Features", "Compact Design"]
  }
];

export const seedCars = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing cars
    await Car.deleteMany({});
    console.log('Cleared existing cars');

    // Insert new cars
    const insertedCars = await Car.insertMany(cars);
    console.log(`Successfully added ${insertedCars.length} cars to the database`);

    // Display added cars
    console.log('\nAdded cars:');
    insertedCars.forEach(car => {
      console.log(`- ${car.brand} ${car.model}: $${car.pricePerDay}/day`);
    });

    console.log('\nDatabase seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};