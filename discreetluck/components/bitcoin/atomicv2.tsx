// "use client";

// import { useEffect, useState } from "react";
// import { initDLC } from "@/components/bitcoin/createDLC";
// // import BitcoinCfdProvider from "@atomicfinance/bitcoin-cfd-provider";
// // import BitcoinDlcProvider from "@atomicfinance/bitcoin-dlc-provider";
// // import BitcoinRpcProvider from "@atomicfinance/bitcoin-rpc-provider";
// // import { BitcoinJsWalletProvider } from "@atomicfinance/bitcoin-js-wallet-provider";
// // import FinanceClient from "@atomicfinance/client";
// // import { bitcoin, TxInInfoRequest, TxOutRequest } from "@atomicfinance/types";
// // import { BitcoinNetworks } from "bitcoin-networks";

// // const RPC_USER = process.env.RPC_USER;
// // const RPC_PASSWORD = process.env.RPC_PASSWORD;
// const RPC_PORT = process.env.RPC_PORT;
// const RPC_HOST = process.env.RPC_HOST || "127.0.0.1";

// interface CreateFundTransactionResponse {
//   hex: string;
// }

// const DLCOfferCreate = () => {
//   const [dlcResult, setDlcResult] =
//     useState<CreateFundTransactionResponse | null>(null);
//   const [walletAddress, setWalletAddress] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     async function createDLC() {
//       setLoading(true);
//       try {
//         const [fundTxnResp, address] = await initDLC();
//         setDlcResult(fundTxnResp);
//         setWalletAddress(address);
//       } catch (e) {
//         console.error("Error creating DLC:", e);
//       }
//       setLoading(false);
//     }

//     createDLC();
//   }, []);

//   return (
//     <div className="p-5 text-white bg-gray-900">
//       <h1 className="text-2xl font-bold mb-4">Create DLC Offer</h1>

//       {loading ? (
//         <p>Loading... Please wait while the DLC is being created.</p>
//       ) : (
//         <>
//           {dlcResult ? (
//             <div className="bg-gray-800 p-4 rounded">
//               <h2 className="text-xl font-semibold">DLC Created</h2>
//               <pre className="whitespace-pre-wrap">
//                 {JSON.stringify(dlcResult, null, 2)}
//               </pre>
//             </div>
//           ) : (
//             <p>No DLC created yet.</p>
//           )}

//           {walletAddress && (
//             <div className="mt-4">
//               <h3 className="text-lg font-semibold">Unused Wallet Address</h3>
//               <p>{walletAddress}</p>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default DLCOfferCreate;
