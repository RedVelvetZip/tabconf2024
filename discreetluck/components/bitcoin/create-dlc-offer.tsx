"use client";

import { useState } from "react";
import { getPublicKey, utils, schnorr } from "noble-secp256k1";

// const contractDescriptor = new ContractDescriptorV0();
// contractDescriptor.outcomes = [
//   {
//     outcome: Buffer.from("RED_TEAM_WIN"),
//     localPayout: BigInt(8e5),
//   },
//   {
//     outcome: Buffer.from("BLUE_TEAM_WIN"),
//     localPayout: BigInt(2e5),
//   },
//   {
//     outcome: Buffer.from("DEFAULT_REFUND"),
//     localPayout: BigInt(5e5),
//   },
// ];

const CreateDlcOffer = () => {
  // Default values that resemble the Polymarket bids
  const [collateralSatoshis, setCollateralSatoshis] = useState("1097500"); // Initial size similar to first bid
  const [feeRatePerVb, setFeeRatePerVb] = useState("10");
  const [cetLocktime, setCetLocktime] = useState("1700000000");
  const [refundLocktime, setRefundLocktime] = useState("1700000500");
  const [offerResult, setOfferResult] = useState(null);

  const privKey = process.env.NEXT_PUBLIC_EX_PRIV_KEY || "";
  const [pubKey, setPubKey] = useState<string>("");

  const createOffer = async () => {
    try {
      // Post offer data to Nostr
      const nostrResult = await postNostrBid({
        price: "0.01", // Adjust price as necessary
        collateralSatoshis,
        feeRatePerVb,
        cetLocktime,
        refundLocktime,
      });
      if (nostrResult) {
        alert("Offer posted to Nostr successfully!");
      }
    } catch (error) {
      console.error("Error creating DLC offer:", error);
      alert("Failed to create DLC offer");
    }
  };

  const postNostrBid = async (offerData: any) => {
    if (!privKey) {
      console.error("Private key is missing for Nostr!");
      return;
    }

    const pubKey = getPublicKey(privKey, true).substring(2);
    setPubKey(pubKey);

    const relay = "ws://localhost:8080"; // Replace with your actual Nostr relay
    const socket = new WebSocket(relay);

    socket.addEventListener("open", async () => {
      console.log("Connected to " + relay);

      const event = {
        content: JSON.stringify(offerData),
        created_at: Math.floor(Date.now() / 1000),
        kind: 1, // Kind 1 for public messages
        tags: [
          ["p", pubKey],
          ["dlc", "DLC Offer"],
        ],
        pubkey: pubKey,
      };

      const signedEvent = await getSignedEvent(event, privKey);
      socket.send(JSON.stringify(["EVENT", signedEvent]));

      console.log("Offer posted to Nostr:", signedEvent);
      socket.close();
    });

    return new Promise((resolve) => {
      socket.addEventListener("message", (message) => {
        const [type, subId, event] = JSON.parse(message.data);
        console.log("Nostr Response:", event);
        resolve(true);
      });
    });
  };

  return (
    <div className="p-5 text-[#000000]">
      <h1 className="text-2xl mb-4 text-[#ffffff]">Create Offer</h1>

      <div className="mb-4">
        <p className="text-white">Price: 0.01</p>
        <input
          type="text"
          placeholder="Collateral Satoshis"
          value={collateralSatoshis}
          onChange={(e) => setCollateralSatoshis(e.target.value)}
          className="mb-2 p-2 rounded bg-gray-200"
        />
        <input
          type="text"
          placeholder="Fee Rate per Vb"
          value={feeRatePerVb}
          onChange={(e) => setFeeRatePerVb(e.target.value)}
          className="mb-2 p-2 rounded bg-gray-200"
        />
        <input
          type="text"
          placeholder="CET Locktime"
          value={cetLocktime}
          onChange={(e) => setCetLocktime(e.target.value)}
          className="mb-2 p-2 rounded bg-gray-200"
        />
        <input
          type="text"
          placeholder="Refund Locktime"
          value={refundLocktime}
          onChange={(e) => setRefundLocktime(e.target.value)}
          className="mb-2 p-2 rounded bg-gray-200"
        />
      </div>

      <button
        onClick={createOffer}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Create Offer and Post to Nostr
      </button>

      {offerResult && (
        <div className="mt-4">
          <p>Offer Created: {JSON.stringify(offerResult)}</p>
        </div>
      )}
    </div>
  );
};

// Helper functions for signing and encoding the Nostr event.
const bytesToHex = (bytes: Uint8Array): string =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");

const getSignedEvent = async (event: any, privateKey: string): Promise<any> => {
  const eventData = JSON.stringify([
    0,
    event["pubkey"],
    event["created_at"],
    event["kind"],
    event["tags"],
    event["content"],
  ]);

  const eventHash = await utils.sha256(new TextEncoder().encode(eventData));
  event.id = bytesToHex(new Uint8Array(eventHash));
  event.sig = await schnorr.sign(event.id, privateKey);
  return event;
};

export default CreateDlcOffer;
