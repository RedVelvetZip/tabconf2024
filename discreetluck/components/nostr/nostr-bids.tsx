"use client";

import { useEffect, useState } from "react";
import { getSharedSecret, getPublicKey, utils, schnorr } from "noble-secp256k1";

const NostrBids: React.FC = () => {
  const [pubKey, setPubKey] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [bids, setBids] = useState<{ price: string; size: string }[]>([]);
  const [messages, setMessages] = useState<{ content: string; time: number }[]>(
    []
  );
  const privKey = process.env.NEXT_PUBLIC_EX_PRIV_KEY || "";

  useEffect(() => {
    const initialize = async () => {
      if (!privKey) {
        console.error("Private key is missing!");
        return;
      }

      const pubKey = getPublicKey(privKey, true).substring(2);
      setPubKey(pubKey);

      const relay = "ws://localhost:8080";
      const socket = new WebSocket(relay);
      setSocket(socket);

      socket.addEventListener("open", async () => {
        console.log("connected to " + relay);

        const subId = bytesToHex(utils.randomPrivateKey()).substring(0, 16);
        const filter = { authors: [pubKey], kinds: [1] }; // Fetch bids of kind 1
        const subscription = ["REQ", subId, filter];
        console.log("Subscription:", subscription);

        socket.send(JSON.stringify(subscription));
      });

      socket.addEventListener("message", async (message) => {
        const [type, subId, event] = JSON.parse(message.data);
        const { kind, content, created_at } = event || {};
        if (!event || event === true) return;

        console.log("message:", event);

        if (kind === 1) {
          // Assuming event.content contains bid info
          const parsedContent = JSON.parse(content);
          const newBid = {
            price: parsedContent.price,
            size: parsedContent.size,
          };
          setBids((prev) => [...prev, newBid]);
        }
      });

      return () => {
        socket.close();
      };
    };

    initialize();
  }, [privKey]);

  const handleFillOrder = async (bid: { price: string; size: string }) => {
    if (!socket || !pubKey || !privKey) {
      console.error("Socket, pubKey, or privKey missing");
      return;
    }

    const filledOrderMessage = {
      content: `Filled bid: price ${bid.price}, size ${bid.size}`,
      created_at: Math.floor(Date.now() / 1000),
      kind: 1,
      tags: [["p", pubKey]],
      pubkey: pubKey,
    };

    const signedEvent = await getSignedEvent(filledOrderMessage, privKey);
    socket.send(JSON.stringify(["EVENT", signedEvent]));

    console.log("Filled order posted to Nostr:", filledOrderMessage);
  };

  return (
    <div>
      <h2>Nostr Bids</h2>
      {bids.length > 0 ? (
        bids.map((bid, index) => (
          <div key={index} className="order">
            <p>
              <strong>Price:</strong> {bid.price}
            </p>
            <p>
              <strong>Size:</strong> {bid.size}
            </p>
            <button
              onClick={() => handleFillOrder(bid)}
              className="mt-2 p-2 bg-blue-500 text-white rounded"
            >
              Fill Order
            </button>
          </div>
        ))
      ) : (
        <p>No Nostr bids available</p>
      )}
    </div>
  );
};

// Helper functions are the same as before, no change needed.
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

export default NostrBids;
