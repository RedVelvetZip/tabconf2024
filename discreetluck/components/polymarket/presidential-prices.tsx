"use client";

import React, { useEffect, useState } from "react";

// Hardcoded Token IDs
const DEMOCRATIC_TOKEN_ID =
  "11015470973684177829729219287262166995141465048508201953575582100565462316088";
const REPUBLICAN_TOKEN_ID =
  "65444287174436666395099524416802980027579283433860283898747701594488689243696";

// Mock API function to get the prices (this would call the actual API in practice)
const fetchPrices = async (tokenId: string) => {
  // Replace this with the actual API call using clobClient.getPrice
  const response = await fetch(
    `https://clob.polymarket.com/price?token_id=${tokenId}&side=buy`
  );
  const buyPrice = await response.json();

  const sellResponse = await fetch(
    `https://clob.polymarket.com/price?token_id=${tokenId}&side=sell`
  );
  const sellPrice = await sellResponse.json();

  return {
    buy: buyPrice.price,
    sell: sellPrice.price,
  };
};

const PresidentialPrices: React.FC = () => {
  const [democraticPrices, setDemocraticPrices] = useState<{
    buy: string;
    sell: string;
  } | null>(null);
  const [republicanPrices, setRepublicanPrices] = useState<{
    buy: string;
    sell: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the prices for both tokens on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch Democratic prices
        const demPrices = await fetchPrices(DEMOCRATIC_TOKEN_ID);
        setDemocraticPrices(demPrices);

        // Fetch Republican prices
        const repPrices = await fetchPrices(REPUBLICAN_TOKEN_ID);
        setRepublicanPrices(repPrices);
      } catch (err) {
        setError("Failed to fetch prices.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Presidential Election Market Prices</h1>
      {loading ? (
        <p>Loading prices...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <br />
          <h2>Democratic Party</h2>
          {democraticPrices ? (
            <p>
              <strong>BUY Price:</strong> {democraticPrices.buy} <br />
              <strong>SELL Price:</strong> {democraticPrices.sell}
            </p>
          ) : (
            <p>No price data for Democratic Party</p>
          )}
          <br />
          <h2>Republican Party</h2>
          {republicanPrices ? (
            <p>
              <strong>BUY Price:</strong> {republicanPrices.buy} <br />
              <strong>SELL Price:</strong> {republicanPrices.sell}
            </p>
          ) : (
            <p>No price data for Republican Party</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PresidentialPrices;
