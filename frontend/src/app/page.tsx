// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Home() {
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     // Fetch data from backend API
//     axios
//       .get("http://localhost:5000/api/hello")
//       .then((res) => {
//         setMessage(res.data.message);
//       })
//       .catch((err) => {
//         console.error("API Error:", err);
//       });
//   }, []);

//   return (
//     <div className="flex flex-col h-screen items-center justify-center bg-gray-900 text-white">
//       <h1 className="text-3xl font-bold">Frontend + Backend Connection</h1>
//       <p className="mt-4 text-xl">{message || "Loading..."}</p>
//     </div>
//   );
// }



"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [message, setMessage] = useState<string>("Loading...");

  useEffect(() => {
    // Call backend API when component mounts
    axios
      .get("http://localhost:5000/api/hello")
      .then((res) => {
        setMessage(res.data.message); // set response from backend
      })
      .catch((err) => {
        console.error("❌ API Error:", err);
        setMessage("Failed to fetch from backend");
      });
  }, []);

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Frontend + Backend Connection ✅</h1>
      <p className="mt-4 text-xl">{message}</p>
    </div>
  );
}
