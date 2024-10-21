const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
require("dotenv").config();

// Enable CORS for all routes
app.use(cors());

const RPC_USER = process.env.RPC_USER;
const RPC_PASSWORD = process.env.RPC_PASSWORD;
const RPC_PORT = process.env.RPC_PORT;
const RPC_HOST = process.env.RPC_HOST || "127.0.0.1";

app.use(express.json());

const getRPCData = async (method, params = []) => {
  const url = `http://${RPC_USER}:${RPC_PASSWORD}@${RPC_HOST}:${RPC_PORT}`;
  console.log(`RPC URL: ${url}, Method: ${method}, Params: ${params}`);
  try {
    const response = await axios.post(
      url,
      {
        jsonrpc: "1.0",
        id: "curltext",
        method: method,
        params: params,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response && response.data && response.data.result) {
      return response.data.result;
    } else {
      throw new Error("Invalid response structure from RPC");
    }
  } catch (error) {
    console.error(
      `Error calling ${method}:`,
      error.response?.data || error.message
    );
    return null;
  }
};

// API route to get the last 5 blocks
app.get("/blocks", async (req, res) => {
  try {
    console.log("Fetching latest block hash...");

    const latestBlockHash = await getRPCData("getbestblockhash");
    console.log("Latest block hash:", latestBlockHash);

    if (!latestBlockHash) {
      throw new Error("Failed to retrieve the latest block hash");
    }

    const latestBlock = await getRPCData("getblock", [latestBlockHash]);
    console.log("Latest block:", latestBlock);

    if (!latestBlock || !latestBlock.previousblockhash) {
      throw new Error(
        "Failed to retrieve the latest block or missing previous block hash"
      );
    }

    let blocks = [latestBlock];
    let currentBlockHash = latestBlock.previousblockhash;

    for (let i = 0; i < 5; i++) {
      if (!currentBlockHash) {
        console.log("No more previous blocks to fetch.");
        break;
      }

      const block = await getRPCData("getblock", [currentBlockHash]);
      console.log(`Fetched block ${i + 1}:`, block);

      if (!block || !block.previousblockhash) {
        console.log("Block or previousblockhash is missing.");
        break;
      }

      blocks.push(block);
      currentBlockHash = block.previousblockhash;
    }

    res.json({ blocks });
  } catch (error) {
    console.error("Error fetching blocks:", error);
    res.status(500).json({ error: "Failed to fetch blocks" });
  }
});

app.get("/blocks/:blockHash/transactions", async (req, res) => {
  const blockHash = req.params.blockHash;
  try {
    const block = await getRPCData("getblock", [blockHash]);

    if (!block || !block.tx) {
      return res
        .status(404)
        .json({ error: "Block not found or no transactions available" });
    }

    // Fetch transaction details for the block
    const txDetails = await Promise.all(
      block.tx.map(async (txid) => {
        return await getRPCData("getrawtransaction", [txid, true]);
      })
    );

    res.json({ txDetails });
  } catch (error) {
    console.error(`Error fetching transactions for block ${blockHash}:`, error);
    res.status(500).json({ error: "Failed to fetch transaction details" });
  }
});

const port = 4001;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
