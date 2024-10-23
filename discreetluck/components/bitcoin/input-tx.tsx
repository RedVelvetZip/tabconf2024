"use client";

import { useState } from "react";
import axios from "axios";

const TransactionSender = () => {
  const [senderAddress, setSenderAddress] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendTransaction = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await axios.post("http://localhost:4001/send-tx", {
        senderAddress,
        recipientAddress,
        amount,
      });

      setResult(`Transaction sent successfully! TXID: ${response.data.txid}`);
    } catch (err) {
      setError(`Error sending transaction: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 w-full max-w-md bg-gray-800 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">Send Transaction</h2>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">
          Sender Address:
        </label>
        <input
          type="text"
          value={senderAddress}
          onChange={(e) => setSenderAddress(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
          placeholder="Enter Sender's Bitcoin Address"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">
          Recipient Address:
        </label>
        <input
          type="text"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
          placeholder="Enter Recipient's Bitcoin Address"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">
          Amount (BTC):
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
          placeholder="Enter amount"
        />
      </div>

      <button
        onClick={sendTransaction}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Transaction"}
      </button>

      {result && <p className="text-green-400 mt-4">{result}</p>}
      {error && <p className="text-red-400 mt-4">{error}</p>}
    </div>
  );
};

export default TransactionSender;
