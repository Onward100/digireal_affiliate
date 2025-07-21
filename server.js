const express = require("express");
const connectDB = require("./config/connectDB");
const dotenv = require("dotenv");
const cors = require("cors");
const router = require("./routes/auth");
const propertyRouter = require("./routes/property.js");

const app = express();
dotenv.config();

// Connect to DB
connectDB();

// Middleware
app.use(express.json());

// CORS setup (fixed)
app.use(
  cors({
    origin: [
      process.env.CORS_ORIGIN,
      "http://localhost:5000",
      "http://localhost:3001",
      "http://localhost:3000",
      "https://digireal-affiliate-jw3j.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", router);
app.use("/api/v1/properties", propertyRouter);

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
