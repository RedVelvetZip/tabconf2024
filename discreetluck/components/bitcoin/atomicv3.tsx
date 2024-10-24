"use client";

import { useEffect, useState } from "react";

interface CreateFundTransactionResponse {
  hex: string;
}

const DLCOfferCreate = () => {
  const [dlcResult, setDlcResult] =
    useState<CreateFundTransactionResponse | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function createDLC() {
      setLoading(true);
      try {
        const response = await fetch("/api/createDLC", {
          method: "POST",
        });
        const data = await response.json();
        if (response.ok) {
          setDlcResult(data.result);
          setWalletAddress(data.address);
        } else {
          console.error("Error creating DLC:", data.error);
        }
      } catch (e) {
        console.error("Error creating DLC:", e);
      }
      setLoading(false);
    }

    createDLC();
  }, []);

  return (
    <div className="p-5 text-white bg-gray-900">
      <h1 className="text-2xl font-bold mb-4">Create DLC Offer</h1>

      {loading ? (
        <p>Loading... Please wait while the DLC is being created.</p>
      ) : (
        <>
          {dlcResult ? (
            <div className="bg-gray-800 p-4 rounded">
              <h2 className="text-xl font-semibold">DLC Created</h2>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(dlcResult, null, 2)}
              </pre>
            </div>
          ) : (
            <p>No DLC created yet.</p>
          )}

          {walletAddress && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Unused Wallet Address</h3>
              <p>{walletAddress}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DLCOfferCreate;
