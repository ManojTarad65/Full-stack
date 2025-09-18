"use client";
import { useState } from "react";

export default function AddProductPage() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    review: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        price: Number(form.price),
        description: form.description,
        category: form.category,
        review: form.review,
      }),
    });

    const data = await res.json();
    console.log("✅ Product Added:", data);
    alert("Product Added!");
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-xl w-96 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Add New Product</h2>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
        />

        <input
          type="text"
          name="review"
          placeholder="Review"
          value={form.review}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
