import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      match: [/^[0-9+\-\s]{10,15}$/, "Enter a valid phone number"],
    },
    address: { type: String, required: [true, "Address is required"], trim: true },
    membershipDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Member", memberSchema);