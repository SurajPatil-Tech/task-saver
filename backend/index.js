import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import todoRoute from "./routes/todo.route.js";
import userRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI;

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/todo", todoRoute);
app.use("/user", userRoute);

// Database connection and server startup
try {
  await mongoose.connect(DB_URI);
  console.log("Connected to MongoDB");

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error("Database connection failed:", error);
  process.exit(1);
}