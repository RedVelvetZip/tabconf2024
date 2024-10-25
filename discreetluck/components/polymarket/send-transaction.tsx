import { useState } from "react";

const SendTransactionButton = () => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendTransaction = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/sendTransaction", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.text(); // Assuming the response is text
      setResult(data);
    } catch (error: any) {
      console.error("Error sending transaction:", error);
      setError(error.message || "Failed to send the transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleSendTransaction}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        {loading ? "Sending..." : "Send Transaction"}
      </button>

      {result && (
        <div className="mt-4 p-2 bg-gray-800 text-white rounded">
          <h4 className="text-lg font-semibold">Transaction Result:</h4>
          <pre>{result}</pre>
        </div>
      )}

      {error && (
        <div className="mt-4 p-2 bg-red-500 text-white rounded">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default SendTransactionButton;
