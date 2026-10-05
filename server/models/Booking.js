const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a registered user'],
      index: true,
    },
    ambulance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ambulance',
      required: [true, 'Ambulance reference is required'],
      index: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    pickupAddress: {
      type: String,
      required: [true, 'Pickup address is required'],
      trim: true,
      maxlength: [300, 'Pickup address cannot exceed 300 characters'],
    },
    pickupLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    destinationAddress: {
      type: String,
      required: [true, 'Destination or hospital address is required'],
      trim: true,
      maxlength: [300, 'Destination address cannot exceed 300 characters'],
    },
    destinationLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [77.21, 28.62],
      },
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
      maxlength: [100, 'Patient name cannot exceed 100 characters'],
    },
    patientPhone: {
      type: String,
      required: [true, 'Patient emergency contact phone is required'],
      trim: true,
    },
    emergencyNotes: {
      type: String,
      maxlength: [500, 'Emergency notes cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: [
        'REQUESTED',
        'ACCEPTED',
        'ON_THE_WAY',
        'ARRIVED',
        'TRIP_STARTED',
        'COMPLETED',
        'CANCELLED',
        'REJECTED',
      ],
      default: 'REQUESTED',
      index: true,
    },
    distanceKm: {
      type: Number,
      default: 0,
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    acceptedAt: {
      type: Date,
    },
    onTheWayAt: {
      type: Date,
    },
    arrivedAt: {
      type: Date,
    },
    tripStartedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
      maxlength: [300, 'Cancellation reason cannot exceed 300 characters'],
    },
    cancelledBy: {
      type: String,
      enum: ['PATIENT', 'DRIVER', 'ADMIN', 'SYSTEM'],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate human-readable unique booking number
bookingSchema.pre('save', function (next) {
  if (!this.bookingNumber) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const dateCode = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    this.bookingNumber = `AN-${dateCode}-${randomDigits}`;
  }
  next();
});

bookingSchema.index({ pickupLocation: '2dsphere' });
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ driver: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
