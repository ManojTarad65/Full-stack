import mongoose from "mongoose";

// Define schema (structure of product)
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // name is mandatory
  },
  price: {
    type: Number,
    required: true, // price is mandatory
  },
  category: {
    type: String,
    required: true,
  },
  review : {
    type : String,
    required : true,
  },

  // user id of the user who created the product -> owner
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true,
  },
},
{
 timestamps : true,
},
);

// Create model (collection in MongoDB will be "products")
const Product = mongoose.model("Product", productSchema);

export default Product;
