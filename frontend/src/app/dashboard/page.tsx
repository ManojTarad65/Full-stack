"use client";
import { useEffect, useState } from "react";

// Product Type (TypeScript Interface)
interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state (used for both Add + Edit)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null); // if not null → edit mode

  // ✅ Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on page load
  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Add or Update product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update product
        const res = await fetch(
          `http://localhost:5000/api/products/${editingId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formData,
              price: Number(formData.price),
            }),
          }
        );

        if (res.ok) {
          alert("✅ Product updated!");
          setEditingId(null);
          setFormData({ name: "", price: "", description: "", category: "" });
          fetchProducts();
        }
      } else {
        // Add product
        const res = await fetch("http://localhost:5000/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, price: Number(formData.price) }),
        });

        if (res.ok) {
          alert("✅ Product added!");
          setFormData({ name: "", price: "", description: "", category: "" });
          fetchProducts();
        }
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // ✅ Delete product
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("🗑 Product deleted!");
        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // ✅ Set form to edit mode
  const handleEdit = (product: Product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-white bg-gray-900">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🛍 Product Dashboard
      </h1>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-md mx-auto mb-8"
      >
        <h2 className="text-xl font-bold mb-4">
          {editingId ? "✏️ Edit Product" : "➕ Add Product"}
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded text-white font-bold"
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* ================= PRODUCT LIST ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-gray-800 p-4 rounded-xl shadow-md flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-400">{product.category}</p>
              <p className="mt-2">{product.description}</p>
              <p className="mt-3 font-bold text-blue-400">${product.price}</p>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(product)}
                className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
