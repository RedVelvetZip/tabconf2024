const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();
// const {
//   ContractInfoV0,
//   ContractDescriptorV0,
//   OracleInfoV0,
// } = require("@dlc-messaging/ContractInfo");
// const Oracle = require("path-to-Oracle");

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

const RPC_USER = process.env.RPC_USER;
const RPC_PASSWORD = process.env.RPC_PASSWORD;
const RPC_PORT = process.env.RPC_PORT;
const RPC_HOST = process.env.RPC_HOST || "127.0.0.1";

// const oracle = new Oracle("ExampleOracle", 1);
// const oracleInfo = oracle.GetOracleInfo();

// AtomicFinance DLC stuff
// const Client = require("@atomicfinance/client").default;
// const BitcoinDlcProvider =
//   require("@atomicfinance/bitcoin-dlc-provider").default;
// const bitcoin = new Client();
// const BitcoinNetworks = require("bitcoin-networks").default;
// const network = "regtest"; //BitcoinNetworks.bitcoin_testnet;
// bitcoin.addProvider(new BitcoinDlcProvider(network));
// const BitcoinJsWalletProvider =
//   require("@atomicfinance/bitcoin-js-wallet-provider").default;
// bitcoin.addProvider(
//   new BitcoinJsWalletProvider({
//     network,
//     mnemonic: "your-mnemonic-here", // Replace with your mnemonic
//     baseDerivationPath: `m/84'/${network.coinType}'/0'`,
//     addressType: "bech32",
//   })
// );

// Helper function to read wallets from wallets.json
const getWallets = () => {
  const walletData = fs.readFileSync("./wallets.json", "utf-8");

  return JSON.parse(walletData).wallets;
};

const getRPCData = async (method, params = []) => {
  const url = `http://${RPC_USER}:${RPC_PASSWORD}@${RPC_HOST}:${RPC_PORT}`;
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

// API route to get the balance of a specific address
app.get("/balance/:address", async (req, res) => {
  const address = req.params.address;

  try {
    // Get the list of unspent outputs for the specific address
    const unspentOutputs = await getRPCData("listunspent", [
      0,
      9999999,
      [address],
    ]);

    // Calculate the total balance by summing up the amounts from unspent outputs
    const balance = unspentOutputs.reduce(
      (total, utxo) => total + utxo.amount,
      0
    );

    res.json({ balance });
  } catch (error) {
    console.error(`Error fetching balance for address ${address}:`, error);
    res.status(500).json({ error: "Failed to fetch balance" });
  }
});

// API route to send Bitcoin transaction
app.post("/send", async (req, res) => {
  const { receiver, amount } = req.body;

  try {
    // Execute the sendtoaddress command to send Bitcoin
    const txid = await getRPCData("sendtoaddress", [receiver, amount]);
    res.json({ txid });
  } catch (error) {
    console.error("Error sending transaction:", error);
    res.status(500).json({ error: "Failed to send transaction" });
  }
});

// API route to get wallets
app.get("/wallets", (req, res) => {
  try {
    const wallets = getWallets();
    res.json(wallets);
  } catch (error) {
    console.error("Error fetching wallets:", error);
    res.status(500).json({ error: "Failed to fetch wallets" });
  }
});

// API route to create DLC offer
app.post("/create-dlc-offer", async (req, res) => {
  try {
    const { collateralSatoshis, feeRatePerVb, cetLocktime, refundLocktime } =
      req.body;

    // Create Contract Descriptor
    const contractDescriptor = new ContractDescriptorV0();
    contractDescriptor.outcomes = [
      {
        outcome: "WIN",
        localPayout: BigInt(100000), // Example payout
      },
      {
        outcome: "LOSE",
        localPayout: BigInt(0),
      },
    ];

    // Create Oracle Info
    const oracleEvent = oracleInfo.rValues;
    const oraclePubKey = oracleInfo.publicKey;
    const oracleInfoV0 = new OracleInfoV0(oracleEvent, oraclePubKey);

    // Create Contract Info
    const contractInfo = new ContractInfoV0();
    contractInfo.totalCollateral = BigInt(collateralSatoshis);
    contractInfo.contractDescriptor = contractDescriptor;
    contractInfo.oracleInfo = oracleInfoV0;

    const dlcOffer = await client.dlc.createDlcOffer(
      contractInfo,
      BigInt(collateralSatoshis),
      BigInt(feeRatePerVb),
      cetLocktime,
      refundLocktime
    );

    res.json({ dlcOffer });
  } catch (error) {
    console.error("Error creating DLC offer:", error);
    res.status(500).json({ error: "Failed to create DLC offer" });
  }
});

const port = 4001;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
