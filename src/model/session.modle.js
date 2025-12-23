import { Schema, Types } from "mongoose";

const sessionSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
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
  //   lastActive: {
  //     type: String,
  //   },
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
});
