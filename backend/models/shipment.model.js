import mongoose from "mongoose";

const trackingHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'exception'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  notes: String
});

const shipmentSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false // Allow null for public tracking
  },
  sender: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: { type: String, required: true }
  },
  recipient: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: { type: String, required: true }
  },
  packageDetails: {
    type: {
      type: String,
      enum: ['box', 'envelope', 'tube', 'pallet', 'other'],
      default: 'box'
    },
    weight: { type: Number, required: true },
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    value: Number,
    description: { type: String, required: true }
  },
  serviceType: {
    type: String,
    enum: ['standard', 'express', 'overnight', 'ground', 'international'],
    default: 'standard'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'exception'],
    default: 'pending'
  },
  currentLocation: String,
  trackingHistory: [trackingHistorySchema],
  insurance: { type: Boolean, default: false },
  signatureRequired: { type: Boolean, default: false },
  specialInstructions: String,
  shippingDate: Date,
  estimatedDelivery: Date,
  actualDelivery: Date,
  shippingCost: { type: Number, default: 0 },
  coordinates: {
    latitude: Number,
    longitude: Number
  }
}, { 
  timestamps: true 
});

// Generate tracking number before saving
shipmentSchema.pre('save', function(next) {
  if (!this.trackingNumber) {
    this.trackingNumber = 'GL' + Date.now().toString() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

// Add tracking history entry when status changes
shipmentSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.trackingHistory.push({
      status: this.status,
      location: this.currentLocation || 'Processing facility',
      timestamp: new Date()
    });
  }
  next();
});

const Shipment = mongoose.model("Shipment", shipmentSchema);

export default Shipment;