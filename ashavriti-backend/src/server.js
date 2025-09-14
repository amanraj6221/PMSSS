// 📂 src/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

// 🔹 Routes import
import authRoutes from "./routes/auth.routes.js";               // User auth (register/login)
import applicationRoutes from "./routes/application.routes.js"; // User + SAG + Finance application flow
import financeAuthRoutes from "./routes/financeAuth.js";        // Finance auth
import financeAppRoutes from "./routes/financeApplications.js"; // Finance applications
import sagAuthRoutes from "./routes/sag/sagAuth.routes.js";     // SAG Bureau auth

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// make io accessible in routes
app.set("io", io);

// ✅ Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME || "ashavriti",
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ✅ Routes
app.use("/api/auth", authRoutes);                 // User register/login
app.use("/api/applications", applicationRoutes);  // User + SAG + Finance flow
app.use("/api/finance/auth", financeAuthRoutes);  // Finance register/login
app.use("/api/applications/finance", financeAppRoutes); 
app.use("/api/sag/auth", sagAuthRoutes);          // SAG Bureau register/login

// ✅ Basic route check
app.get("/", (req, res) => {
  res.send("🚀 Ashavriti Scholarship API is running...");
});

// ✅ Socket.io listeners
io.on("connection", (socket) => {
  console.log("🔗 New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ✅ Error Handler (last middleware)
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
