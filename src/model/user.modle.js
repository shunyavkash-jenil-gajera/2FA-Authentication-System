import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    enabled_2fa: {
      type: Boolean,
      require: true,
      default: true,
    },
    secrete2fa: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);
export default User;
