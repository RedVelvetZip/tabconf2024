"use client";

import CreateDlcOffer from "@/components/bitcoin/create-dlc-offer";
import DisplayBlocks from "@/components/bitcoin/display-blocks";
import SendTransaction from "@/components/bitcoin/send-tx";
import NostrBids from "@/components/nostr/nostr-bids";
import NostrInterface from "@/components/nostr/nostr-interface";
import OrderList from "@/components/polymarket/get-open-orders";
import ActiveOrders from "@/components/polymarket/get-open-orders";
import MarketQuestions from "@/components/polymarket/market-questions";
import PresidentialMarket from "@/components/polymarket/presidential-market";
import PresidentialPrices from "@/components/polymarket/presidential-prices";
import SendTransactionButton from "@/components/polymarket/send-transaction";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MarketMaker() {
  const router = useRouter();
  const [priceData, setPriceData] = useState(null);

  const handleSendPrices = (data: any) => {
    setPriceData(data);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <main className="flex flex-col gap-8 items-center justify-center w-full">
        <h1>~Market Maker Interface~</h1>
        <div className="flex justify-between">
          <div className="w-1/2 p-4">
            <OrderList />
          </div>

          <div className="w-1/2 p-4">
            <NostrBids />
          </div>
        </div>
        <div className="w-full">
          {/* <SendTransactionButton />
          <ActiveOrders />
          <CreateDlcOffer /> */}
        </div>
        <div className="w-full">
          <PresidentialPrices onSendPrices={handleSendPrices} />
          <NostrInterface priceData={priceData} />
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
