/**
 * Firestore Seed Script
 * 
 * Run this from the browser console or create a temporary route to populate
 * Firestore with sample data. This gives the app realistic content immediately.
 * 
 * Usage: Import and call seedDatabase() from a component or the console.
 */

import { db } from './config';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';

const sampleCars = [
  {
    brand: 'BMW',
    model: 'M4 Competition',
    year: 2024,
    fuel: 'Petrol',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    pricePerDay: 189,
    rating: 4.9,
    reviewCount: 42,
    location: 'San Francisco, CA',
    available: true,
    seats: 4,
    mileage: '24',
    description: 'The BMW M4 Competition delivers breathtaking performance with its twin-turbocharged 3.0-liter inline-six engine producing 503 horsepower. Featuring an aggressive design, carbon fiber roof, and M-tuned suspension.',
    images: [
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=2115&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=2115&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop'
    ],
    features: ['Twin-Turbo Engine', 'Carbon Fiber Roof', 'M Sport Exhaust', 'Head-Up Display', 'Adaptive Suspension', 'Harman Kardon Audio'],
    brandLower: 'bmw',
    modelLower: 'm4 competition',
  },
  {
    brand: 'Mercedes-Benz',
    model: 'AMG GT 63',
    year: 2024,
    fuel: 'Petrol',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    pricePerDay: 299,
    rating: 4.9,
    reviewCount: 38,
    location: 'Los Angeles, CA',
    available: true,
    seats: 4,
    mileage: '21',
    description: 'The Mercedes-AMG GT 63 is a masterpiece of engineering and luxury. With its handcrafted 4.0L V8 biturbo engine delivering 577 horsepower, this four-door coupe combines supercar performance with ultimate elegance.',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2070&auto=format&fit=crop'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2070&auto=format&fit=crop'
    ],
    features: ['V8 Biturbo', 'AMG Performance Seats', 'Burmester Sound', 'Air Suspension', 'AMG Track Pace', 'Panoramic Roof'],
    brandLower: 'mercedes-benz',
    modelLower: 'amg gt 63',
  },
  {
    brand: 'Tesla',
    model: 'Model S Plaid',
    year: 2024,
    fuel: 'Electric',
    fuelType: 'Electric',
    transmission: 'Automatic',
    pricePerDay: 249,
    rating: 4.8,
    reviewCount: 65,
    location: 'San Francisco, CA',
    available: true,
    seats: 5,
    mileage: '120 MPGe',
    description: 'The Tesla Model S Plaid redefines electric performance with its tri-motor setup producing over 1,020 horsepower and a 0-60 mph time of under 2 seconds. With a 396-mile range and advanced autopilot.',
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071&auto=format&fit=crop'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071&auto=format&fit=crop'
    ],
    features: ['Tri-Motor AWD', 'Autopilot', '17" Touchscreen', '0-60 in 1.99s', '396 Mile Range', 'Gaming Computer'],
    brandLower: 'tesla',
    modelLower: 'model s plaid',
  },
  {
    brand: 'Porsche',
    model: '911 Turbo S',
    year: 2024,
    fuel: 'Petrol',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    pricePerDay: 399,
    rating: 5.0,
    reviewCount: 29,
    location: 'Miami, FL',
    available: true,
    seats: 4,
    mileage: '20',
    description: 'The Porsche 911 Turbo S is the benchmark for sports car perfection. Its 3.8L twin-turbocharged flat-six produces 640 horsepower, launching from 0-60 in just 2.6 seconds.',
    images: [
      'https://images.unsplash.com/photo-1503376760367-13eea36b1d44?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1503376760367-13eea36b1d44?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop'
    ],
    features: ['Twin-Turbo Flat-6', 'PDK Transmission', 'Sport Chrono', 'Rear-Axle Steering', 'Active Aero', 'Bose Surround Sound'],
    brandLower: 'porsche',
    modelLower: '911 turbo s',
  },
  {
    brand: 'Audi',
    model: 'RS e-tron GT',
    year: 2024,
    fuel: 'Electric',
    fuelType: 'Electric',
    transmission: 'Automatic',
    pricePerDay: 279,
    rating: 4.7,
    reviewCount: 31,
    location: 'New York, NY',
    available: true,
    seats: 4,
    mileage: '83 MPGe',
    description: 'The Audi RS e-tron GT combines stunning Gran Turismo design with pure electric performance. Dual motors produce 637 horsepower, propelling this elegant sedan from 0-60 in 3.1 seconds.',
    images: [
      'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop'
    ],
    features: ['Dual Motor AWD', '800V Charging', 'Air Suspension', 'Matrix LED', 'Bang & Olufsen 3D', 'Virtual Cockpit Plus'],
    brandLower: 'audi',
    modelLower: 'rs e-tron gt',
  },
  {
    brand: 'Lamborghini',
    model: 'Huracán EVO',
    year: 2023,
    fuel: 'Petrol',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    pricePerDay: 599,
    rating: 5.0,
    reviewCount: 22,
    location: 'Miami, FL',
    available: true,
    seats: 2,
    mileage: '15',
    description: 'The Lamborghini Huracán EVO is a symphony of Italian engineering excellence. Its naturally aspirated 5.2L V10 produces 631 horsepower, delivering a visceral driving experience.',
    images: [
      'https://images.unsplash.com/photo-1662993093557-cc3c38b4a709?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2074&auto=format&fit=crop'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1662993093557-cc3c38b4a709?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2074&auto=format&fit=crop'
    ],
    features: ['V10 Engine', 'LDVI System', 'Carbon Ceramic Brakes', 'ALA Active Aero', 'Sensonum Audio', 'Drive Mode Selector'],
    brandLower: 'lamborghini',
    modelLower: 'huracán evo',
  },
  {
    brand: 'Range Rover',
    model: 'Sport SVR',
    year: 2024,
    fuel: 'Petrol',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    pricePerDay: 249,
    rating: 4.8,
    reviewCount: 27,
    location: 'Chicago, IL',
    available: true,
    seats: 5,
    mileage: '18',
    description: 'The Range Rover Sport SVR combines luxury SUV comfort with supercar performance. Its supercharged 5.0L V8 delivers 575 horsepower, making it one of the fastest SUVs ever built.',
    images: [
      'https://images.unsplash.com/photo-1606016159991-efa9f13612d3?q=80&w=2148&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2070&auto=format&fit=crop'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1606016159991-efa9f13612d3?q=80&w=2148&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2070&auto=format&fit=crop'
    ],
    features: ['Supercharged V8', 'Terrain Response 2', 'Meridian Audio', 'Adaptive Dynamics', 'Wade Sensing'],
    brandLower: 'range rover',
    modelLower: 'sport svr',
  },
  {
    brand: 'Ferrari',
    model: 'Roma Spider',
    year: 2024,
    fuel: 'Petrol',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    pricePerDay: 499,
    rating: 4.9,
    reviewCount: 16,
    location: 'Los Angeles, CA',
    available: true,
    seats: 2,
    mileage: '19',
    description: 'The Ferrari Roma Spider embodies La Nuova Dolce Vita. Its twin-turbocharged 3.9L V8 produces 612 horsepower, paired with an 8-speed dual-clutch transmission.',
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2070&auto=format&fit=crop'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2070&auto=format&fit=crop'
    ],
    features: ['Twin-Turbo V8', 'Retractable Soft Top', '8-Speed DCT', 'Manettino Drive Modes', 'JBL Professional Audio'],
    brandLower: 'ferrari',
    modelLower: 'roma spider',
  }
];

/**
 * Seeds the Firestore database with sample car data.
 * @returns {Promise<void>}
 */
export async function seedDatabase() {
  const carsCol = collection(db, 'cars');
  console.log('🚗 Starting database seed...');
  let count = 0;
  for (const car of sampleCars) {
    try {
      await addDoc(carsCol, {
        ...car,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      count++;
      console.log(`✅ Added: ${car.brand} ${car.model}`);
    } catch (error) {
      console.error(`❌ Failed to add ${car.brand} ${car.model}:`, error);
    }
  }
  console.log(`\n🎉 Seed complete! Added ${count}/${sampleCars.length} cars.`);
}

export async function seedAdminUser(uid, name, email) {
  try {
    await setDoc(doc(db, 'users', uid), {
      uid,
      name,
      email,
      photo: '',
      favorites: [],
      role: 'admin',
      createdAt: serverTimestamp(),
    });
    console.log(`✅ Admin user created: ${name} (${email})`);
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
  }
}
