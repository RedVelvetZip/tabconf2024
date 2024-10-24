const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
require("dotenv").config();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

const RPC_URL = process.env.POLYGON_RPC_URL || "http://127.0.0.1:8545"; // Set your Polygon node RPC URL

const getRPCData = async (method, params = []) => {
  try {
    const response = await axios.post(
      RPC_URL,
      {
        jsonrpc: "2.0",
        id: 1,
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
    // Fetch the latest block number
    const latestBlockNumberHex = await getRPCData("eth_blockNumber");
    const latestBlockNumber = parseInt(latestBlockNumberHex, 16);

    let blocks = [];
    for (let i = 0; i < 5; i++) {
      const block = await getRPCData("eth_getBlockByNumber", [
        `0x${(latestBlockNumber - i).toString(16)}`,
        true,
      ]);
      if (block) {
        blocks.push(block);
      }
    }

    res.json({ blocks });
  } catch (error) {
    console.error("Error fetching blocks:", error);
    res.status(500).json({ error: "Failed to fetch blocks" });
  }
});

// API route to get transactions for a specific block
app.get("/blocks/:blockHash/transactions", async (req, res) => {
  const blockHash = req.params.blockHash;
  try {
    const block = await getRPCData("eth_getBlockByHash", [blockHash, true]);

    if (!block || !block.transactions) {
      return res
        .status(404)
        .json({ error: "Block not found or no transactions available" });
    }

    res.json({ transactions: block.transactions });
  } catch (error) {
    console.error(`Error fetching transactions for block ${blockHash}:`, error);
    res.status(500).json({ error: "Failed to fetch transaction details" });
  }
});

// API route to get the balance of a specific address
app.get("/balance/:address", async (req, res) => {
  const address = req.params.address;

  try {
    // Get the balance for the address
    const balanceHex = await getRPCData("eth_getBalance", [address, "latest"]);
    const balance = parseInt(balanceHex, 16) / 1e18; // Convert from Wei to Ether

    res.json({ balance });
  } catch (error) {
    console.error(`Error fetching balance for address ${address}:`, error);
    res.status(500).json({ error: "Failed to fetch balance" });
  }
});

// API route to send a transaction
app.post("/send", async (req, res) => {
  const { receiver, amount, sender, privateKey } = req.body;

  try {
    // Create and send the transaction using web3 or similar libraries
    // This would involve signing the transaction and broadcasting it
    // You can use libraries like ethers.js or web3.js to handle this

    const txHash = "0xTRANSACTION_HASH"; // Replace this with the actual transaction hash
    res.json({ txHash });
  } catch (error) {
    console.error("Error sending transaction:", error);
    res.status(500).json({ error: "Failed to send transaction" });
  }
});

const port = 4002;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
