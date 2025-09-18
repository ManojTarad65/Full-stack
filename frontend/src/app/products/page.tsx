"use client";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-white bg-gray-900">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Products</h1>

      {products.length === 0 ? (
        <p className="text-center">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-400">{product.category}</p>
              <p className="mt-2">{product.description}</p>
              <p className="mt-3 font-bold text-blue-400">${product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
