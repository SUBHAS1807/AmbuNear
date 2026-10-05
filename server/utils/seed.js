/**
 * AmbuNear - Sample Demonstration Data Seeder
 * Populates database with explicitly labeled DEMO records for testing and pilot review.
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Ambulance = require('../models/Ambulance');
const Booking = require('../models/Booking');

const seedData = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ambunear';

  try {
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB.');

    // Clear existing data
    await User.deleteMany({});
    await Driver.deleteMany({});
    await Ambulance.deleteMany({});
    await Booking.deleteMany({});
    console.log('[Seed] Cleaned existing collections.');

    const defaultPassword = 'DemoPassword@123';
    const passwordHash = await User.hashPassword(defaultPassword);

    // 1. Create Admin
    const adminUser = await User.create({
      name: 'System Administrator (Demo)',
      email: 'admin@ambunear.com',
      phone: '+91 98111-00001',
      passwordHash,
      role: 'ADMIN',
      accountStatus: 'ACTIVE',
    });

    // 2. Create Patient User
    const patientUser = await User.create({
      name: 'Rahul Sharma (Demo Patient)',
      email: 'patient@ambunear.com',
      phone: '+91 98222-00002',
      passwordHash,
      role: 'PATIENT',
      accountStatus: 'ACTIVE',
    });

    // 3. Create Drivers
    const driverUser1 = await User.create({
      name: 'Suresh Kumar (Demo Driver 1)',
      email: 'driver1@ambunear.com',
      phone: '+91 98333-00003',
      passwordHash,
      role: 'DRIVER',
      accountStatus: 'ACTIVE',
    });

    const driverUser2 = await User.create({
      name: 'Rajesh Verma (Demo Driver 2)',
      email: 'driver2@ambunear.com',
      phone: '+91 98444-00004',
      passwordHash,
      role: 'DRIVER',
      accountStatus: 'ACTIVE',
    });

    const driverUser3 = await User.create({
      name: 'Amit Patel (Demo Driver 3)',
      email: 'driver3@ambunear.com',
      phone: '+91 98555-00005',
      passwordHash,
      role: 'DRIVER',
      accountStatus: 'ACTIVE',
    });

    // 4. Create Ambulances (Explicitly labeled DEMO with pilot coordinates)
    const ambulance1 = await Ambulance.create({
      vehicleNumber: 'DEMO-DL-01-AB-1001',
      ambulanceType: 'ADVANCED_LIFE_SUPPORT',
      driver: driverUser1._id,
      contactNumber: '+91 98333-00003',
      location: {
        type: 'Point',
        coordinates: [77.218, 28.625], // Sector 4 Pilot Area
      },
      humanReadableAddress: 'Demo Station 1, Central Metro Gate, Pilot Sector',
      availability: 'AVAILABLE',
      verificationStatus: 'VERIFIED',
      equipment: ['Ventilator', 'ECG Monitor', 'Oxygen Cylinder', 'Defibrillator', 'Stretcher'],
      baseFare: 1200,
    });

    const ambulance2 = await Ambulance.create({
      vehicleNumber: 'DEMO-DL-02-CD-2002',
      ambulanceType: 'BASIC_LIFE_SUPPORT',
      driver: driverUser2._id,
      contactNumber: '+91 98444-00004',
      location: {
        type: 'Point',
        coordinates: [77.205, 28.615], // Sector 2 Pilot Area
      },
      humanReadableAddress: 'Demo Station 2, Community Health Post, Pilot Sector',
      availability: 'AVAILABLE',
      verificationStatus: 'VERIFIED',
      equipment: ['Oxygen Cylinder', 'First Aid Kit', 'Wheelchair', 'Stretcher'],
      baseFare: 600,
    });

    const ambulance3 = await Ambulance.create({
      vehicleNumber: 'DEMO-DL-03-EF-3003',
      ambulanceType: 'PATIENT_TRANSPORT',
      driver: driverUser3._id,
      contactNumber: '+91 98555-00005',
      location: {
        type: 'Point',
        coordinates: [77.23, 28.63], // Sector 5 Pilot Area
      },
      humanReadableAddress: 'Demo Station 3, North Bypass Hub, Pilot Sector',
      availability: 'BUSY',
      verificationStatus: 'VERIFIED',
      equipment: ['First Aid Kit', 'Wheelchair', 'Foldable Stretcher'],
      baseFare: 400,
    });

    // 5. Create Driver Profiles linked to ambulances
    await Driver.create({
      user: driverUser1._id,
      licenseNumber: 'DL-DEMO-2026-0001',
      licenseVerificationStatus: 'VERIFIED',
      isAvailable: true,
      assignedAmbulance: ambulance1._id,
      currentLocation: {
        type: 'Point',
        coordinates: [77.218, 28.625],
      },
      totalTripsCompleted: 14,
      rating: 4.9,
    });

    await Driver.create({
      user: driverUser2._id,
      licenseNumber: 'DL-DEMO-2026-0002',
      licenseVerificationStatus: 'VERIFIED',
      isAvailable: true,
      assignedAmbulance: ambulance2._id,
      currentLocation: {
        type: 'Point',
        coordinates: [77.205, 28.615],
      },
      totalTripsCompleted: 8,
      rating: 4.8,
    });

    await Driver.create({
      user: driverUser3._id,
      licenseNumber: 'DL-DEMO-2026-0003',
      licenseVerificationStatus: 'VERIFIED',
      isAvailable: false,
      assignedAmbulance: ambulance3._id,
      currentLocation: {
        type: 'Point',
        coordinates: [77.23, 28.63],
      },
      totalTripsCompleted: 22,
      rating: 4.7,
    });

    // 6. Create a Sample Past Booking
    await Booking.create({
      bookingNumber: 'AN-2026-DEMO-01',
      user: patientUser._id,
      ambulance: ambulance2._id,
      driver: driverUser2._id,
      pickupAddress: 'House 42, Green Avenue, Pilot District',
      pickupLocation: {
        type: 'Point',
        coordinates: [77.206, 28.616],
      },
      destinationAddress: 'City Memorial Hospital, Main Emergency Ward',
      destinationLocation: {
        type: 'Point',
        coordinates: [77.22, 28.63],
      },
      patientName: 'Rahul Sharma',
      patientPhone: '+91 98222-00002',
      emergencyNotes: 'Sample past trip: Chest congestion, required oxygen support.',
      status: 'COMPLETED',
      distanceKm: 2.3,
      requestedAt: new Date(Date.now() - 3600000 * 24),
      acceptedAt: new Date(Date.now() - 3600000 * 24 + 60000 * 2),
      onTheWayAt: new Date(Date.now() - 3600000 * 24 + 60000 * 4),
      arrivedAt: new Date(Date.now() - 3600000 * 24 + 60000 * 12),
      tripStartedAt: new Date(Date.now() - 3600000 * 24 + 60000 * 15),
      completedAt: new Date(Date.now() - 3600000 * 24 + 60000 * 35),
    });

    console.log('[Seed] Database seeded with explicitly labeled demo records!');
    console.log(`===================================================`);
    console.log(`Demo Credentials (All accounts use password: "${defaultPassword}"):`);
    console.log(`   Admin:   ${adminUser.email}`);
    console.log(`   Patient: ${patientUser.email}`);
    console.log(`   Driver:  ${driverUser1.email}`);
    console.log(`   Driver:  ${driverUser2.email}`);
    console.log(`===================================================`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    process.exit(1);
  }
};

seedData();
