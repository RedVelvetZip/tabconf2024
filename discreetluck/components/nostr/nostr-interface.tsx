"use client";

import { useEffect, useState } from "react";
import { getSharedSecret, getPublicKey, utils, schnorr } from "noble-secp256k1";

const NostrInterface: React.FC = () => {
  const [pubKey, setPubKey] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
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
        const filter = { authors: [pubKey] };
        const subscription = ["REQ", subId, filter];
        console.log("Subscription:", subscription);

        socket.send(JSON.stringify(subscription));

        // Send first event
        const event = {
          content: "testing00",
          created_at: Math.floor(Date.now() / 1000),
          kind: 1,
          tags: [
            ["p", pubKey],
            ["discreetluck_contract", "DLC"],
            ["discreetluck_unit", "BTC"],
            [
              "discreetluck_market",
              "which-party-will-win-the-2024-united-states-presidential-election",
            ], //hardcoded in the market for polymarket presential election
            ["discreetluck_tx", "OfferCreate"],
          ],
          pubkey: pubKey,
        };
        const signedEvent = await getSignedEvent(event, privKey);
        socket.send(JSON.stringify(["EVENT", signedEvent]));

        // Send second encrypted event
        const message = "testing01";
        const encrypted = await encrypt(privKey, pubKey, message);
        const event2 = {
          content: encrypted,
          created_at: Math.floor(Date.now() / 1000),
          kind: 4,
          tags: [["p", pubKey]],
          pubkey: pubKey,
        };
        const signedEvent2 = await getSignedEvent(event2, privKey);
        socket.send(JSON.stringify(["EVENT", signedEvent2]));
      });

      socket.addEventListener("message", async (message) => {
        const [type, subId, event] = JSON.parse(message.data);
        const { kind, content, created_at } = event || {};
        if (!event || event === true) return;

        console.log("message:", event);
        if (kind === 4) {
          const decryptedContent = await decrypt(
            privKey,
            event.pubkey,
            content
          );
          // Update messages state with decrypted content and timestamp
          setMessages((prev) => [
            ...prev,
            { content: decryptedContent, time: created_at },
          ]);
        } else {
          // Update messages state with plain content and timestamp
          setMessages((prev) => [...prev, { content, time: created_at }]);
        }
      });

      return () => {
        socket.close();
      };
    };

    initialize();
  }, [privKey]);

  // Function to display messages
  const handleDisplayMessages = () => {
    messages.forEach((msg) => {
      console.log(
        `Time: ${new Date(msg.time * 1000).toLocaleString()} - Message: ${
          msg.content
        }`
      );
    });
  };

  return (
    <div>
      <div>Connected to Nostr Relay as {pubKey}</div>
      <button
        onClick={handleDisplayMessages}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Display Messages
      </button>
      <div className="mt-4">
        <h3>Received Messages:</h3>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>Time:</strong>{" "}
              {new Date(msg.time * 1000).toLocaleString()} -{" "}
              <strong>Message:</strong> {msg.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Helper functions
const hexToBytes = (hex: string): Uint8Array =>
  Uint8Array.from(hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));

const bytesToHex = (bytes: Uint8Array): string =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");

const encrypt = async (
  privkey: string,
  pubkey: string,
  text: string
): Promise<string> => {
  const keyMaterial = await getSharedKeyMaterial(privkey, pubkey);
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const encodedText = new TextEncoder().encode(text);

  const encryptedContent = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    keyMaterial,
    encodedText
  );

  return `${btoa(
    String.fromCharCode(...new Uint8Array(encryptedContent))
  )}?iv=${btoa(String.fromCharCode(...iv))}`;
};

const decrypt = async (
  privkey: string,
  pubkey: string,
  ciphertext: string
): Promise<string> => {
  const [encryptedTextBase64, ivBase64] = ciphertext.split("?iv=");
  const keyMaterial = await getSharedKeyMaterial(privkey, pubkey);

  const encryptedText = Uint8Array.from(atob(encryptedTextBase64), (c) =>
    c.charCodeAt(0)
  );
  const iv = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0));

  const decryptedContent = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    keyMaterial,
    encryptedText
  );

  return new TextDecoder().decode(decryptedContent);
};

const getSharedKeyMaterial = async (
  privkey: string,
  pubkey: string
): Promise<CryptoKey> => {
  const sharedSecret = getSharedSecret(
    privkey,
    "02" + pubkey,
    true
  ) as Uint8Array;

  return await crypto.subtle.importKey(
    "raw",
    sharedSecret, // sharedSecret should be a Uint8Array
    { name: "AES-CBC" },
    false,
    ["encrypt", "decrypt"]
  );
};

const getSignedEvent = async (event: any, privateKey: string): Promise<any> => {
  const eventData = JSON.stringify([
    0, // Reserved for future use
    event["pubkey"], // The sender's public key
    event["created_at"], // Unix timestamp
    event["kind"], // Message "kind" or type
    event["tags"], // Tags identify replies/recipients
    event["content"], // Your note contents
  ]);

  const eventHash = await utils.sha256(new TextEncoder().encode(eventData));
  event.id = bytesToHex(new Uint8Array(eventHash));
  event.sig = await schnorr.sign(event.id, privateKey);
  return event;
};

export default NostrInterface;
