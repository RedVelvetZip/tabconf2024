"use client";

import { useState } from "react";

const DisplayBlocks = () => {
  const rpcUrl = "http://localhost:4001";

  interface Block {
    hash: string;
    height: number;
    time: number;
  }

  interface Transaction {
    txid: string;
    vin: Array<{
      txid: string;
      vout: number;
      scriptSig: { asm: string; hex: string };
      txinwitness?: string[];
      sequence: number;
    }>;
    vout: Array<{ value: number; scriptPubKey: { addresses: string[] } }>;
  }

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [transactions, setTransactions] = useState<{
    [blockHash: string]: Transaction[];
  }>({});
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingTx, setLoadingTx] = useState<{ [blockHash: string]: boolean }>(
    {}
  );
  const [expandedBlocks, setExpandedBlocks] = useState<{
    [blockHash: string]: boolean;
  }>({});
  const [expandedTransactions, setExpandedTransactions] = useState<{
    [txid: string]: boolean;
  }>({});
  const [showBlocks, setShowBlocks] = useState(true);

  const toggleBlockExpand = (blockHash: string) => {
    setExpandedBlocks((prevState) => ({
      ...prevState,
      [blockHash]: !prevState[blockHash],
    }));
  };

  const toggleTransactionExpand = (txid: string) => {
    setExpandedTransactions((prevState) => ({
      ...prevState,
      [txid]: !prevState[txid],
    }));
  };

  const fetchBlocks = async () => {
    setLoadingBlocks(true);
    try {
      const response = await fetch(`${rpcUrl}/blocks`);
      const data = await response.json();
      if (data && data.blocks) {
        setBlocks(data.blocks);
      }
    } catch (error) {
      console.error("Error fetching blocks:", error);
    } finally {
      setLoadingBlocks(false);
    }
  };

  const fetchTransactions = async (blockHash: string) => {
    setLoadingTx((prevState) => ({ ...prevState, [blockHash]: true }));
    try {
      const response = await fetch(
        `${rpcUrl}/blocks/${blockHash}/transactions`
      );
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (data && data.txDetails) {
          setTransactions((prevState) => ({
            ...prevState,
            [blockHash]: data.txDetails,
          }));
        } else {
          setTransactions((prevState) => ({
            ...prevState,
            [blockHash]: [],
          }));
        }
      } else {
        throw new Error("Received non-JSON response from server.");
      }
    } catch (error) {
      console.error(
        `Error fetching transactions for block ${blockHash}:`,
        error
      );
    } finally {
      setLoadingTx((prevState) => ({ ...prevState, [blockHash]: false }));
    }
  };

  return (
    <div className="font-sans p-5 w-full text-left ml-0 bg-[#1e202b]">
      <h1 className="text-2xl font-bold mb-4">Last 5 Blocks</h1>
      <button
        onClick={fetchBlocks}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Fetch Last 5 Blocks
      </button>

      <button
        onClick={() => setShowBlocks(!showBlocks)}
        className="bg-gray-500 text-white px-4 py-2 rounded mb-4 ml-4"
      >
        {showBlocks ? "Hide Blocks" : "Show Blocks"}
      </button>

      {loadingBlocks ? (
        <p>Loading...</p>
      ) : showBlocks && blocks && blocks.length > 0 ? (
        <ul className="list-none p-0 w-full">
          {blocks.map((block, index) => (
            <li key={index} className="mb-6">
              <div>
                <strong>Block {block.height}:</strong> {block.hash}
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded ml-4"
                  onClick={() => toggleBlockExpand(block.hash)}
                >
                  {expandedBlocks[block.hash] ? "Hide" : "Show"} Transactions
                </button>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(block.time * 1000).toLocaleString()}
              </div>
              {expandedBlocks[block.hash] && (
                <div>
                  <button
                    onClick={() => fetchTransactions(block.hash)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                  >
                    {loadingTx[block.hash]
                      ? "Loading Transactions..."
                      : "Load Transactions"}
                  </button>
                  {transactions[block.hash] &&
                  transactions[block.hash].length > 0 ? (
                    <ul className="list-none pl-5 mt-3">
                      {transactions[block.hash].map(
                        (tx, txIndex) =>
                          tx ? (
                            <li key={txIndex} className="mb-4">
                              <strong>Transaction ID:</strong> {tx.txid}
                              <button
                                className="bg-gray-500 text-white px-4 py-2 rounded ml-4"
                                onClick={() => toggleTransactionExpand(tx.txid)}
                              >
                                {expandedTransactions[tx.txid]
                                  ? "Hide Details"
                                  : "Show Details"}
                              </button>
                              {expandedTransactions[tx.txid] && (
                                <div>
                                  <strong>Inputs:</strong>
                                  <ul>
                                    {tx.vin.map((input, inputIndex) => (
                                      <li key={inputIndex}>
                                        <strong>From TXID:</strong> {input.txid}{" "}
                                        <br />
                                        <strong>Output Index:</strong>{" "}
                                        {input.vout} <br />
                                        {input.txinwitness && (
                                          <p>
                                            Witness:{" "}
                                            {input.txinwitness?.join(", ") ||
                                              "N/A"}
                                          </p>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                  <strong>Outputs:</strong>
                                  <ul>
                                    {tx.vout.map((output, voutIndex) => (
                                      <li key={voutIndex}>
                                        <strong>Value:</strong> {output.value}{" "}
                                        BTC <br />
                                        <strong>Addresses:</strong>{" "}
                                        {output.scriptPubKey.addresses?.join(
                                          ", "
                                        ) || "N/A"}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </li>
                          ) : null // Skip rendering if `tx` is null
                      )}
                    </ul>
                  ) : transactions[block.hash] && !loadingTx[block.hash] ? (
                    <p>No transactions available for this block.</p>
                  ) : null}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No blocks to display</p>
      )}
    </div>
  );
};

export default DisplayBlocks;
