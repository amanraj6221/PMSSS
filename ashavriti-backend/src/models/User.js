import mongoose from "mongoose";

// ✅ User Schema with roles & validations
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true, // ✅ ensures consistency
      minlength: [3, "Username must be at least 3 characters long"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },

    // 👇 User Role
    role: {
      type: String,
      enum: ["USER", "SAG", "FINANCE"], // allowed roles
      default: "USER",
    },
  },
  { timestamps: true }
);

// ✅ Index for faster username lookups
userSchema.index({ username: 1 });

// ✅ Model export
const User = mongoose.model("User", userSchema);

export default User;
