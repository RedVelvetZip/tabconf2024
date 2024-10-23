# Discreet Luck

TODO

1. connect to Nostr
   send data
   read data
   sent CET
   complete CET
2. Pull data from Polymarket API to console
3. Test writing txs from the frontend (simple sends)

## Boot up

1. `bitcoind -regtest -txindex=1 -reindex` (root) start a regtest node
2. `npm start` (superrain) start a local nostr relay
3. `node server.js` (/discreetluck) start the server to communicate with the regtest node
4. `npm run dev` (/discreetluck) start the frontend

## Red's notes

make sure to run with -txindex=1 and -reindex or else the tx api call wont work for pulling full tx info

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
