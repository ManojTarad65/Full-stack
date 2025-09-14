// // Import required modules (modern ES syntax)
// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";


// // Load environment variables
// dotenv.config();

// // Initialize Express app
// const app = express();

// // Middleware
// app.use(cors()); // allows requests from frontend
// app.use(express.json()); // parse incoming JSON

// // Connect to MongoDB
// try {
//   await mongoose.connect(process.env.MONGO_URI);
//   console.log("✅ MongoDB Connected");
// } catch (err) {
//   console.error("❌ MongoDB Connection Error:", err.message);
// }

// // Test Route - Root
// app.get("/", (req, res) => {
//   res.send("Backend is running 🚀");
// });

// // Example API Route
// app.get("/api/hello", (req, res) => {
//   res.json({ message: "Hello from backend 👋" });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });



// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import productRoutes from "./routes/productRoutes.js";

// dotenv.config();
// const app = express();

// app.use(cors());
// // parse incoming JSON -> it is used to parse the incoming JSON data
// app.use(express.json());

// // connect mongodb to server 
// try {
//   await mongoose.connect(process.env.MONGO_URI);
//   console.log("✅ MongoDB Connected");
// } catch (err) {
//   console.error("❌ MongoDB Connection Error:", err.message);
// }

// // Test route
// app.get("/", (req, res) => {
//   res.send("Backend is running 🚀");
// });

// // API Routes
// app.use("/api/products", productRoutes);



// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });



// JWT authentication

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// route imports
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// ---------- MIDDLEWARE ----------
// Allow frontend from localhost:3000 to call backend. In production, set origin to your domain.
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Parse JSON bodies (Content-Type: application/json)
app.use(express.json());

// ---------- ROUTES ----------
app.use("/api/auth", authRoutes);         // register, login, get current user
app.use("/api/products", productRoutes);  // CRUD for products (some routes protected)

// ---------- CONNECT TO MONGO & START SERVER ----------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
