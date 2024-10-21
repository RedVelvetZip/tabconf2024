# Discreet Luck

## Boot up

in this order:

1. start a regtest node
2. start the server to communicate with the regtest node
3. start the frontend

commands

1. `bitcoind -regtest -txindex=1 -reindex` (root)
2. `node server.js` (/discreetluck)
3. `npm run dev` (/discreetluck)

## Red's local notes

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

## First run

Create some blocks and txs on your regtest node
