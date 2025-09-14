// // routes/productRoutes.js
// import express from "express";
// import Product from "../models/Product.js";

// const router = express.Router();

// // @route   POST /api/products
// // @desc    Create new product
// router.post("/", async (req, res) => {
//   try {
//     const { name, price, category } = req.body;
//     const newProduct = new Product({ name, price, category });
//     await newProduct.save();
//     res.status(201).json(newProduct);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // @route   GET /api/products
// // @desc    Get all products
// router.get("/", async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // @route   GET /api/products/:id
// // @desc    Get single product
// router.get("/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // @route   PUT /api/products/:id
// // @desc    Update product
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedProduct = await Product.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!updatedProduct)
//       return res.status(404).json({ message: "Product not found" });
//     res.json(updatedProduct);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // @route   DELETE /api/products/:id
// // @desc    Delete product
// router.delete("/:id", async (req, res) => {
//   try {
//     const deletedProduct = await Product.findByIdAndDelete(req.params.id);
//     if (!deletedProduct)
//       return res.status(404).json({ message: "Product not found" });
//     res.json({ message: "Product deleted" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;



// import express from "express";
// import Product from "../models/Product.js";

// //it is used to create a router object
// const router = express.Router();

// // GET all products
// router.get("/", async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // POST a new product
// router.post("/products", async (req, res) => {
//   try {
//     const { name, price, description, category,review  } = req.body;

//     const product = new Product({
//       name,
//       price,
//       description,  
//       category,
//       review,
//     });

//     const createdProduct = await product.save();
//     res.status(201).json(createdProduct);
//   } catch (error) {
//     res.status(400).json({ message: "Invalid product data" });
//   }
// });

// export default router;


// routes/productRoutes.js
import express from "express";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all products (public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("user", "name email"); // include owner info
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST create product (protected)
router.post("/", protect, async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    // req.user is set by protect middleware
    const newProduct = new Product({
      name,
      price,
      description,
      category,
      user: req.user._id,
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Invalid product data" });
  }
});

// PUT update product (protected + owner only)
router.put("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // only owner can update
    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to update this product" });
    }

    // update fields
    product.name = req.body.name ?? product.name;
    product.price = req.body.price ?? product.price;
    product.description = req.body.description ?? product.description;
    product.category = req.body.category ?? product.category;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error updating product" });
  }
});

// DELETE product (protected + owner only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to delete this product" });
    }

    await product.remove();
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting product" });
  }
});

export default router;
