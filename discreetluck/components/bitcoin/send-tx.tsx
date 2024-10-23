"use client";

import { useState, useEffect } from "react";

const SendTransaction = () => {
  const rpcUrl = "http://localhost:4001"; // Your local RPC server

  const [wallets, setWallets] = useState<any[]>([]); // Ensure wallets is initialized as an array
  const [sender, setSender] = useState(""); // Selected sender
  const [receiver, setReceiver] = useState(""); // Selected receiver
  const [amount, setAmount] = useState(""); // Amount to send
  const [balance, setBalance] = useState(0); // Balance of the sender
  const [transactionHash, setTransactionHash] = useState(""); // Transaction result

  // Fetch wallet options from backend on component mount
  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const response = await fetch(`${rpcUrl}/wallets`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setWallets(data); // Ensure only setting if it's an array
        } else {
          console.error("Invalid response format:", data);
        }
      } catch (error) {
        console.error("Error fetching wallets:", error);
      }
    };

    fetchWallets();
  }, []);

  // Function to fetch the balance of the selected sender
  const fetchBalance = async (selectedSender: string) => {
    try {
      const response = await fetch(`${rpcUrl}/balance/${selectedSender}`);
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  // Fetch balance whenever the sender changes
  useEffect(() => {
    if (sender) {
      fetchBalance(sender);
    }
  }, [sender]);

  // Function to handle sending the transaction
  const sendTransaction = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount to send.");
      return;
    }

    try {
      const response = await fetch(`${rpcUrl}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiver,
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();
      setTransactionHash(data.txid);
      alert(`Transaction sent! TXID: ${data.txid}`);
    } catch (error) {
      console.error("Error sending transaction:", error);
      alert("Failed to send the transaction.");
    }
  };

  return (
    <div className="font-sans p-5 w-full text-left bg-[#1e202b] text-white">
      <h1 className="text-2xl font-bold mb-4">Send Bitcoin Transaction</h1>

      <div className="mb-4">
        <label htmlFor="sender" className="block mb-2">
          Select Sender:
        </label>
        <select
          id="sender"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded w-full"
        >
          {wallets
            .filter((wallet: any) => wallet.type === "sender")
            .map((s: any) => (
              <option key={s.address} value={s.address}>
                {s.label} ({s.address})
              </option>
            ))}
        </select>
        <p className="mt-2">Balance: {balance} BTC</p>
      </div>

      <div className="mb-4">
        <label htmlFor="receiver" className="block mb-2">
          Select Receiver:
        </label>
        <select
          id="receiver"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded w-full"
        >
          {wallets
            .filter((wallet: any) => wallet.type === "receiver")
            .map((r: any) => (
              <option key={r.address} value={r.address}>
                {r.label} ({r.address})
              </option>
            ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="amount" className="block mb-2">
          Enter Amount:
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded w-full"
          placeholder="Amount in BTC"
        />
      </div>

      <button
        onClick={sendTransaction}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Send Transaction
      </button>

      {transactionHash && (
        <div className="mt-4">
          <p>
            <strong>Transaction Hash:</strong> {transactionHash}
          </p>
        </div>
      )}
    </div>
  );
};

export default SendTransaction;
