async function main() {
  const [sender, receiver] = await ethers.getSigners();

  // Send 1 ETH from sender to receiver
  const tx = await sender.sendTransaction({
    to: receiver.address,
    value: ethers.utils.parseEther("1.0"), // Send 1 ETH
  });

  console.log(`Transaction Hash: ${tx.hash}`);

  // Wait for the transaction to be mined
  await tx.wait();
  console.log("Transaction mined!");

  // Mine a new block after the transaction
  await network.provider.send("evm_mine");

  console.log("Block mined after transaction");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
