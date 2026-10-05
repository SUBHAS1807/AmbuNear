const mongoose = require('mongoose');

const ambulanceSchema = new mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
      required: [true, 'Vehicle registration number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    ambulanceType: {
      type: String,
      enum: ['BASIC_LIFE_SUPPORT', 'ADVANCED_LIFE_SUPPORT', 'PATIENT_TRANSPORT'],
      default: 'BASIC_LIFE_SUPPORT',
      index: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    contactNumber: {
      type: String,
      required: [true, 'Operator or driver emergency contact number is required'],
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        default: [77.209, 28.6139],
      },
    },
    humanReadableAddress: {
      type: String,
      default: 'Pilot Operating Region',
      trim: true,
    },
    locationUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    availability: {
      type: String,
      enum: ['AVAILABLE', 'BUSY', 'OFFLINE'],
      default: 'AVAILABLE',
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'VERIFIED', // Default demo/pilot ambulances can be verified; admin controls it
      index: true,
    },
    equipment: {
      type: [String],
      default: ['Oxygen Cylinder', 'First Aid Kit', 'Stretcher'],
    },
    baseFare: {
      type: Number,
      default: 500,
    },
  },
  {
    timestamps: true,
  }
);

// 2dsphere index for location searches
ambulanceSchema.index({ location: '2dsphere' });
ambulanceSchema.index({ availability: 1, verificationStatus: 1 });

module.exports = mongoose.model('Ambulance', ambulanceSchema);
