"use client";

import { useState } from "react";

const CreateDlcOffer = () => {
  const [collateralSatoshis, setCollateralSatoshis] = useState("1000000"); // 1 million sats aka 0.01 BTC
  const [feeRatePerVb, setFeeRatePerVb] = useState("10"); // 10 sats/vbyte
  const [cetLocktime, setCetLocktime] = useState("1700000000"); // example
  const [refundLocktime, setRefundLocktime] = useState("1700000500"); // example
  const [offerResult, setOfferResult] = useState(null);

  const createOffer = async () => {
    try {
      const response = await fetch("http://localhost:4001/create-dlc-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractInfo: {}, // TODO
          collateralSatoshis,
          feeRatePerVb,
          cetLocktime,
          refundLocktime,
        }),
      });

      const result = await response.json();
      setOfferResult(result.dlcOffer);
      alert("DLC Offer created successfully!");
    } catch (error) {
      console.error("Error creating DLC offer:", error);
      alert("Failed to create DLC offer");
    }
  };

  return (
    <div className="p-5 text-[#000000]">
      <h1 className="text-2xl mb-4 text-[#ffffff]">Create DLC Offer</h1>

      <input
        type="text"
        placeholder="Collateral Satoshis"
        value={collateralSatoshis}
        onChange={(e) => setCollateralSatoshis(e.target.value)}
        className="mb-4 p-2 rounded bg-gray-200"
      />

      <input
        type="text"
        placeholder="Fee Rate per Vb"
        value={feeRatePerVb}
        onChange={(e) => setFeeRatePerVb(e.target.value)}
        className="mb-4 p-2 rounded bg-gray-200"
      />

      <input
        type="text"
        placeholder="CET Locktime"
        value={cetLocktime}
        onChange={(e) => setCetLocktime(e.target.value)}
        className="mb-4 p-2 rounded bg-gray-200"
      />

      <input
        type="text"
        placeholder="Refund Locktime"
        value={refundLocktime}
        onChange={(e) => setRefundLocktime(e.target.value)}
        className="mb-4 p-2 rounded bg-gray-200"
      />

      <button
        onClick={createOffer}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Create Offer
      </button>

      {offerResult && (
        <div className="mt-4">
          <p>DLC Offer Created: {JSON.stringify(offerResult)}</p>
        </div>
      )}
    </div>
  );
};

export default CreateDlcOffer;
