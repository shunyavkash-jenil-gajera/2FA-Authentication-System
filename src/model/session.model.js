import { model, Schema, Types } from "mongoose";

const sessionSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  accessToken: {
    type: String,
    require: true,
  },
  ip: {
    type: String,
    default: null,
  },
  deviceName: {
    type: String,
    default: null,
  },
  os: {
    type: String,
    default: null,
  },
  deviceFingerprint: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    require: true,
    default: true,
  },
  is2FaComplete: {
    type: Boolean,
    require: true,
    default: false,
  },
  isTrustedDevice: {
    type: Boolean,
    require: true,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  twoFaExpiry: {
    type: Date,
    default: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  },
});

const Session = model("Session", sessionSchema);
export default Session;
