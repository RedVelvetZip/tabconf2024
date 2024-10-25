# Discreet Luck

tasks:

- read basic tx from bitcoin node ✅
- write basic tx to bitcoin node ✅
- read from polymarket API ✅
- write to polymarket API ✅
- read basic post from nostr ✅
- write basic post to nostr ✅
- create DLC OfferCreate ✖️
- use polymarket as oracle for DLC ✖️
- write DLC OfferCreate to nostr ✅
- read DLC OfferCreate from nostr ✅
- manually accept DLC OfferAccept ✅
- create CETs for accepted DLC ✖️
- programmatically send DLC OfferAccept ✖️
- programmatically hedge DLC OfferAccept with polymarket API post ✖️
- adjust Nostr custom tags to have a nullifier attribute to alert users if a DLC OfferCreate has already been filled. this will essentially filter out 'used' offers ✖️

## Boot up

1. (root) start a regtest node
   `bitcoind -regtest -txindex=1 -reindex`
   1b. interact with bitcoin-cli. eg generate a block
   `bitcoin-cli -regtest generatetoaddress 1 bcrt1qgjukxd3vjrz9qf0588mdj5j5w3fenyhl0g5y7j`

2. (superrain) start a local nostr relay
   `cd superrain`
   `npm start`

3. (discreetluck) start the server to communicate with the regtest node
   `cd discreetluck`
   `node server.js`

4. (discreetluck) start the frontend
   `cd discreetluck`
   `npm run dev`

Optional
5a. (polygon) start a devnet polygon node
`cd polygon`
`npx hardhat node`
5b. (polygon) interface w node
`cd polygon`
`npx hardhat console --network localhost`

## regtest cmds

`bitcoind -regtest`
`bitcoind -regtest -txindex=1 -reindex`

    load wallet, check balance

`bitcoin-cli -regtest loadwallet "red00"`
`bitcoin-cli -regtest getbalance`

    do this once in the beginning to avoid fee issues. or just set it in the .conf

`bitcoin-cli -regtest settxfee 0.0001`

    example send

`bitcoin-cli -regtest sendtoaddress bcrt1qccs643f00tk7zafejjjc7cfj29eywhkkpxpvjd 2`

    progress 1 block to finalize txs

`bitcoin-cli -regtest generatetoaddress 1 bcrt1qgjukxd3vjrz9qf0588mdj5j5w3fenyhl0g5y7j`
