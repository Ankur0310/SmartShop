"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  console.log("ENV Base:", process.env.NEXT_PUBLIC_API_BASE);


  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/ping`)
      .then(res => res.json())
      .then(data => setMessage(data.message));
      console.log("API response received:", message);
  }, []);

  return <div>API says: {message}</div>;
}
