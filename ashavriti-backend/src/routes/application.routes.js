import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Application from "../models/Application.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===========================================================
   🔹 Multer Setup (File Uploads)
=========================================================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

/* ===========================================================
   USER — Apply for Scholarship
=========================================================== */
router.post(
  "/apply",
  authMiddleware("USER"),
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "documents", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const {
        schemeId,
        schemeName,
        applicantName,
        dob,
        email,
        address,
        casteCategory,
        religion,
        isMinority,
        aadharNumber,
      } = req.body;

      if (!schemeId || !schemeName || !applicantName || !dob || !email) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      // 🔥 Generate URN
      const timestamp = Date.now().toString(36).toUpperCase();
      const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
      const urnNumber = `URN-${timestamp}-${randomStr}`;

      // 🔹 File paths
      const photo = req.files["photo"] ? req.files["photo"][0].path : null;
      const documents = req.files["documents"]
        ? req.files["documents"].map((f) => f.path)
        : [];

      const newApp = await Application.create({
        userId: req.user.id, // ✅ from token
        schemeId,
        schemeName,
        applicantName,
        urnNumber,
        status: "Pending SAG",
        details: {
          dob,
          email,
          address,
          casteCategory,
          religion,
          isMinority,
          aadharNumber,
          photo,
          documents,
        },
      });

      console.log("📌 Application submitted:", urnNumber);

      req.app.get("io")?.emit("newApplication", newApp);

      return res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        urn: urnNumber, // ✅ frontend ko milega
        data: newApp,
      });
    } catch (err) {
      console.error("❌ Application Error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

/* ===========================================================
   SAG — Pending Applications
=========================================================== */
router.get("/sag/pending", authMiddleware("SAG"), async (req, res) => {
  try {
    const apps = await Application.find({ status: "Pending SAG" })
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: apps });
  } catch (err) {
    console.error("❌ SAG Pending Apps Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===========================================================
   SAG — Approve / Reject
=========================================================== */
router.post("/sag/action", authMiddleware("SAG"), async (req, res) => {
  try {
    const { appId, action, remarks } = req.body;
    if (!appId || !action) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const status = action === "approve" ? "Approved by SAG" : "Rejected by SAG";

    const app = await Application.findByIdAndUpdate(
      appId,
      { status, sagRemarks: remarks || "" },
      { new: true }
    ).populate("userId", "username email");

    if (!app) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    console.log("📌 SAG Action:", app.urnNumber, status);

    req.app.get("io")?.emit("sagAction", app);

    res.json({ success: true, message: "Action completed", data: app });
  } catch (err) {
    console.error("❌ SAG Action Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===========================================================
   FINANCE — Pending Applications
=========================================================== */
router.get("/finance/pending", authMiddleware("FINANCE"), async (req, res) => {
  try {
    const apps = await Application.find({ status: "Approved by SAG" })
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: apps });
  } catch (err) {
    console.error("❌ Finance Pending Apps Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===========================================================
   FINANCE — Approve / Reject
=========================================================== */
router.post("/finance/action", authMiddleware("FINANCE"), async (req, res) => {
  try {
    const { appId, action, remarks, amount } = req.body;
    if (!appId || !action) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const status =
      action === "approve" ? "Approved by Finance" : "Rejected by Finance";

    const updateData = { status, financeRemarks: remarks || "" };
    if (amount) updateData.amount = amount;

    const app = await Application.findByIdAndUpdate(appId, updateData, {
      new: true,
    }).populate("userId", "username email");

    if (!app) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    console.log("📌 Finance Action:", app.urnNumber, status);

    req.app.get("io")?.emit("financeAction", app);

    res.json({ success: true, message: "Action completed", data: app });
  } catch (err) {
    console.error("❌ Finance Action Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===========================================================
   FINANCE — Transfer Payment
=========================================================== */
router.post("/finance/transfer", authMiddleware("FINANCE"), async (req, res) => {
  try {
    const { appId } = req.body;
    if (!appId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing appId" });
    }

    const app = await Application.findByIdAndUpdate(
      appId,
      {
        status: "Money Transferred",
        paymentRemarks: "Funds transferred successfully",
      },
      { new: true }
    ).populate("userId", "username email");

    if (!app) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    console.log("💰 Payment Transferred:", app.urnNumber);

    req.app.get("io")?.emit("paymentTransferred", app);

    res.json({ success: true, message: "Payment transferred", data: app });
  } catch (err) {
    console.error("❌ Finance Transfer Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===========================================================
   USER — Application History
=========================================================== */
router.get("/user/:userId", authMiddleware("USER"), async (req, res) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied to other user's data" });
    }

    const apps = await Application.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });

    res.json({ success: true, data: apps });
  } catch (err) {
    console.error("❌ User Applications Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
