import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    apiKey: {
      type: String,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

const Tenant = mongoose.model("Tenant", tenantSchema);

export default Tenant;