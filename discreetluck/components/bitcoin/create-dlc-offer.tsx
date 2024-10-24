"use client";

import { useState } from "react";
import { ContractDescriptorV0 } from "@node-dlc/messaging";

const contractDescriptor = new ContractDescriptorV0();
contractDescriptor.outcomes = [
  {
    outcome: Buffer.from("RED_TEAM_WIN"),
    localPayout: BigInt(8e5),
  },
  {
    outcome: Buffer.from("BLUE_TEAM_WIN"),
    localPayout: BigInt(2e5),
  },
  {
    outcome: Buffer.from("DEFAULT_REFUND"),
    localPayout: BigInt(5e5),
  },
];

import { OracleInfoV0, OracleAnnouncementV0 } from "@node-dlc/messaging";

const oracleInfo = new OracleInfoV0();
oracleInfo.announcement = OracleAnnouncementV0.deserialize(
  Buffer.from("insert_announcement_hex", "hex") //announcement hex link from docs is dead  https://oracle.suredbits.com/
);

const CreateDlcOffer = () => {
  const [collateralSatoshis, setCollateralSatoshis] = useState("1000000");
  const [feeRatePerVb, setFeeRatePerVb] = useState("10");
  const [cetLocktime, setCetLocktime] = useState("1700000000");
  const [refundLocktime, setRefundLocktime] = useState("1700000500");
  const [offerResult, setOfferResult] = useState(null);

  const createOffer = async () => {
    try {
      const response = await fetch("http://localhost:4001/create-dlc-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
