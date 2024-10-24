import * as cfd from "cfd-js-wasm";
import * as cfddlc from "cfd-dlc-js-wasm";
import FinanceClient from "@atomicfinance/client";
import { BitcoinNetworks } from "bitcoin-networks";
import BitcoinRpcProvider from "@atomicfinance/bitcoin-rpc-provider";
import { BitcoinJsWalletProvider } from "@atomicfinance/bitcoin-js-wallet-provider";
import {
  bitcoin,
  CreateFundTransactionResponse,
  TxInInfoRequest,
  TxOutRequest,
} from "@atomicfinance/types";
import BitcoinCfdProvider from "@atomicfinance/bitcoin-cfd-provider";
import BitcoinDlcProvider from "@atomicfinance/bitcoin-dlc-provider";

const RPC_USER = process.env.RPC_USER;
const RPC_PASSWORD = process.env.RPC_PASSWORD;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function initDLC(): Promise<
  [CreateFundTransactionResponse, string]
> {
  // Wait for cfd wasm to load
  while (!cfd.hasLoadedWasm()) {
    console.log("waiting for cfd wasm to load...");
    await sleep(10);
  }

  // Initialize the client
  const client = new FinanceClient();
  const network = BitcoinNetworks.bitcoin_testnet;

  // Add Bitcoin RPC provider
  client.addProvider(
    new BitcoinRpcProvider({
      url: "https://127.0.0.1:18443",
      network,
      username: RPC_USER,
      password: RPC_PASSWORD,
    })
  );

  // Add Bitcoin JS wallet provider
  client.addProvider(
    new BitcoinJsWalletProvider({
      network,
      mnemonic:
        process.env.REACT_APP_MNEMONIC ||
        "mask crane option fun skull fiber camera profit climb problem cave inherit",
      baseDerivationPath: `m/84'/${network.coinType}'/0'`,
      addressType: bitcoin.AddressType.BECH32,
    })
  );

  // Add CFD and DLC providers
  client.addProvider(new BitcoinCfdProvider(cfd.getCfd()));
  client.addProvider(new BitcoinDlcProvider(network, cfddlc.getCfddlc()));

  // Define inputs and change outputs for both parties
  const localInputs: TxInInfoRequest[] = [
    {
      txid: "0000000000000000000000000000000000000000000000000000000000000001",
      vout: 0,
      maxWitnessLength: 108,
      inputSerialId: 0,
    },
  ];

  const localChange: TxOutRequest = {
    address: "bcrt1qlgmznucxpdkp5k3ktsct7eh6qrc4tju7ktjukn",
    amount: 4899999789, // Adjust as necessary
  };

  const remoteInputs: TxInInfoRequest[] = [
    {
      txid: "0000000000000000000000000000000000000000000000000000000000000002",
      vout: 0,
      maxWitnessLength: 108,
      inputSerialId: 1,
    },
  ];

  const remoteChange: TxOutRequest = {
    address: "bcrt1qvh2dvgjctwh4z5w7sc93u7h4sug0yrdz2lgpqf",
    amount: 4899999789, // Adjust as necessary
  };

  // Create DLC fund transaction
  const result = await client.dlc.CreateFundTransaction({
    localPubkey:
      "020b0467b4217a1fee34f6d0e51eac89d67fc152172f42e17d263f7f94543b0bfd", // Replace with actual pubkey
    remotePubkey:
      "03ec03f8e647306d7ddb5674f3d36665a304a77353a8592b586e29725d65485246", // Replace with actual pubkey
    outputAmount: 200000170, // Replace with actual output amount
    localInputs,
    localChange,
    remoteInputs,
    remoteChange,
    feeRate: 100000000, // Replace with actual fee rate
  });

  // setDlcResult(result);
  console.log("DLC Transaction Result:", result);

  // Get an unused address for the wallet
  const address = await client.wallet.getUnusedAddress();
  // setWalletAddress(address.address);
  console.log("Unused Wallet Address:", address);
  return [result, address.address];
}