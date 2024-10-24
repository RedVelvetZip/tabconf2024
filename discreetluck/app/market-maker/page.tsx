import CreateDlcOffer from "@/components/bitcoin/create-dlc-offer";
import DisplayBlocks from "@/components/bitcoin/display-blocks";
import SendTransaction from "@/components/bitcoin/send-tx";
import NostrInterface from "@/components/nostr/nostr-interface";
import MarketQuestions from "@/components/polymarket/market-questions";
import PresidentialMarket from "@/components/polymarket/presidential-market";
import PresidentialPrices from "@/components/polymarket/presidential-prices";

export default function MarketMaker() {
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
      </main>
    </div>
  );
}
