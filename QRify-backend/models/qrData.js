import mongoose from "mongoose";

const qrCodeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: false, // Allow multiple QR codes per user
  },
  qrCodeUserLink: {
    type: String,
    required: true,
  },
  qrCodeImageLink: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
    default: null,
  },
});

// TTL index
qrCodeSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });

const QrData = mongoose.model("QrData", qrCodeSchema, "QrData");
export default QrData;
