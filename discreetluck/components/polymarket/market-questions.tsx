"use client";

import React, { useEffect, useState } from "react";
import { fetchMarkets } from "../../utils/clobClient";

const MarketQuestions: React.FC = () => {
  const [markets, setMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch market data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchMarkets();
        setMarkets(data.data); // Assuming the market data is in `data` field
      } catch (err) {
        setError("Failed to fetch market data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Market Questions</h1>
      {loading ? (
        <p>Loading market data...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {markets.length > 0 ? (
            markets.map((market, index) => (
              <li key={index}>{market.question}</li>
            ))
          ) : (
            <p>No markets available</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default MarketQuestions;
