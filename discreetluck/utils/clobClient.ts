// utils/clobClient.ts
import { ClobClient, BookParams, Side } from "@polymarket/clob-client";

// Initialize the CLOB client for read-only operations (without signer)
export const initializeClobClient = async (): Promise<ClobClient> => {
  const chainId = 137; // Polygon mainnet chain ID
  const clobClient = new ClobClient(
    "https://clob.polymarket.com", // API endpoint
    chainId, // Polygon chain ID
    undefined // No wallet signer required for read-only
  );

  return clobClient;
};

// Fetch midpoints for given tokens
export const fetchMidpoints = async (tokenIds: string[]) => {
  const client = await initializeClobClient();

  const params: BookParams[] = tokenIds.map((id) => ({
    token_id: id,
    side: Side.BUY,
  }));

  const midpoints = await client.getMidpoints(params);
  return midpoints;
};

export const fetchMarkets = async (cursor: string = "") => {
  const response = await fetch(
    `https://clob.polymarket.com/markets?next_cursor=${cursor}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch markets");
  }

  const data = await response.json();
  return data;
};
