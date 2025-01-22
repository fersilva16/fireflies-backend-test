import express from "express";
import mongoose from "mongoose";
import { meetingRoutes } from "./routes/meetings.js";
import { dashboardRoutes } from "./routes/dashboardRoutes.js";
import { authMiddleware } from "./auth.middleware.js";

const { PORT = 3000, MONGODB_URI = "mongodb://localhost:27017/meetingbot" } =
  process.env;

const app = express();

await mongoose
  .connect(MONGODB_URI)
  .then((conn) => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the MeetingBot API" });
});

app.use("/api/meetings", authMiddleware, meetingRoutes);
app.use("/api/dashboard", authMiddleware, dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
