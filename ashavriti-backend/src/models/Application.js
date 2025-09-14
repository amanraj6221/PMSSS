import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // 🔹 User who applied
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // fast lookups
    },

    // 🔹 Scheme Info
    schemeId: {
      type: String,
      required: true,
      index: true,
    },
    schemeName: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔹 Additional details (flexible object)
    details: {
      type: Object,
      default: {},
    },

    // 🔹 URN (Unique Reference Number)
    urnNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // 🔹 Applicant Name
    applicantName: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔹 Applied Date
    appliedDate: {
      type: Date,
      default: Date.now,
    },

    // 🔹 Current Status
    status: {
      type: String,
      enum: [
        "Pending SAG",
        "Rejected by SAG",
        "Approved by SAG",
        "Rejected by Finance",
        "Approved by Finance",
        "Money Transferred",
      ],
      default: "Pending SAG",
    },

    // 🔹 Remarks
    sagRemarks: {
      type: String,
      trim: true,
      default: "",
    },
    financeRemarks: {
      type: String,
      trim: true,
      default: "",
    },

    // 🔹 Amount sanctioned by Finance
    amount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// ✅ Model export
const Application = mongoose.model("Application", applicationSchema);

export default Application;
