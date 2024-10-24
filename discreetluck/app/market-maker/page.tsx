"use client";

import CreateDlcOffer from "@/components/bitcoin/create-dlc-offer";
import DisplayBlocks from "@/components/bitcoin/display-blocks";
import SendTransaction from "@/components/bitcoin/send-tx";
import NostrInterface from "@/components/nostr/nostr-interface";
import MarketQuestions from "@/components/polymarket/market-questions";
import PresidentialMarket from "@/components/polymarket/presidential-market";
import PresidentialPrices from "@/components/polymarket/presidential-prices";

import { useRouter } from "next/navigation";

export default function MarketMaker() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <main className="flex flex-col gap-8 items-center justify-center w-full">
        <h1>~Market Maker Interface~</h1>
        <div className="w-full">
          <CreateDlcOffer />
        </div>
        <div className="w-full">
          {/* <MarketQuestions /> */}
          {/* <PresidentialMarket /> */}
          <PresidentialPrices />
          <NostrInterface />
        </div>
        <div className="w-full">
          Regtest info:
          <DisplayBlocks />
          <SendTransaction />
        </div>
        <div className="w-full">
          <button
            onClick={() => router.push("/")}
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Go to Home page
          </button>
        </div>
      </main>
    </div>
  );
}
