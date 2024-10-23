"use client";

import React, { useEffect, useState } from "react";
import { fetchMidpoints } from "../../utils/clobClient";

const OrderBookFeed: React.FC = () => {
  const [midpoints, setMidpoints] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Example token IDs for fetching midpoints
  const tokenIds = ["tokenA", "tokenB", "tokenC"];

  // Fetch midpoint data on component mount using the REST API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchMidpoints(tokenIds);
        setMidpoints(data);
      } catch (err) {
        setError("Failed to fetch midpoint data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Order Book Feed</h1>
      {loading ? (
        <p>Loading midpoint data...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {midpoints.map((midpoint, index) => (
            <li key={index}>
              Token {index}: {midpoint}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderBookFeed;
