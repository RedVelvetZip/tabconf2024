import DisplayBlocks from "@/components/bitcoin/display-blocks";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <main className="flex flex-col gap-8 items-center justify-center w-full">
        <div className="w-full">
          Regtest info:
          <DisplayBlocks />
        </div>
      </main>
    </div>
  );
}
