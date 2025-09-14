// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Product from "./models/Product.js"; // adjust the path to your Product model

// dotenv.config();

// const MONGO_URI =
//   process.env.MONGO_URI || "mongodb://127.0.0.1:27017/yourdbname";

// const products = [
//   {
//     name: "Nike Air Max",
//     price: 120,
//     description: "Comfortable running shoes",
//     category: "Sneakers",
//   },
//   {
//     name: "Adidas Ultraboost",
//     price: 150,
//     description: "High-performance running shoes",
//     category: "Sneakers",
//   },
//   {
//     name: "Puma Sandals",
//     price: 40,
//     description: "Lightweight summer sandals",
//     category: "Sandals",
//   },
// ];

// const importData = async () => {
//   try {
//     await mongoose.connect(MONGO_URI);

//     // Clear old data
//     await Product.deleteMany();

//     // Insert new data
//     await Product.insertMany(products);

//     console.log("✅ Data Imported Successfully!");
//     process.exit();
//   } catch (error) {
//     console.error("❌ Error with data import:", error);
//     process.exit(1);
//   }
// };

// importData();


// seeder.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Product from "./models/Product.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB for seeding");

    // Remove existing data
    await User.deleteMany();
    await Product.deleteMany();

    // Create demo user
    const demoUser = await User.create({
      name: "Demo User",
      email: "demo@example.com",
      password: "password123", // pre-save hook will hash
    });

    // Create demo products tied to demoUser
    const products = [
      {
        name: "Nike Air Max",
        price: 120,
        description: "Comfortable running shoes",
        category: "Sneakers",
        user: demoUser._id,
      },
      {
        name: "Adidas Ultraboost",
        price: 150,
        description: "High-performance running shoes",
        category: "Sneakers",
        user: demoUser._id,
      },
      {
        name: "Puma Sandals",
        price: 40,
        description: "Lightweight summer sandals",
        category: "Sandals",
        user: demoUser._id,
      },
    ];

    await Product.insertMany(products);
    console.log("✅ Seeder completed");
    process.exit();
  } catch (error) {
    console.error("Seeder error:", error);
    process.exit(1);
  }
};

seed();
