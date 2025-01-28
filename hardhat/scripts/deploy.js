async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy MyToken
  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(deployer.address); // Pass deployer's address as initialOwner
  await myToken.waitForDeployment();
  console.log("MyToken deployed to:", myToken.target);

  // Deploy Nft
  const mintPrice = ethers.parseUnits("1", 18); // 1 MyToken (adjust decimals if needed)
  const MyNFT = await ethers.getContractFactory("NFT");
  const myNFT = await MyNFT.deploy(deployer.address, myToken.target, mintPrice); // Pass constructor args
  await myNFT.waitForDeployment();
  console.log("Nft deployed to:", myNFT.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
