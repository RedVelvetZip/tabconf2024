// utils/polymarketClient.ts
import { ClobClient } from "@polymarket/clob-client";
import { SignatureType } from "@polymarket/order-utils";
import { ethers } from "ethers";
import "dotenv/config";

// Initialize the Polymarket client
const provider = new ethers.providers.JsonRpcProvider(
  "https://polygon-rpc.com"
);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

export const clobClient = new ClobClient(
  "https://clob.polymarket.com",
  137,
  wallet,
  undefined,
  SignatureType.EOA
);
