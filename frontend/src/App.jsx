import { ethers } from "ethers";
import { useEffect, useState } from "react";
import "./App.css";

const myTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const nftAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const myTokenAbi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function approve(address spender, uint256 amount) returns (bool)",
];

const nftAbi = [
  "function mintWithPayment(address to, uint256 tokenId)",
  "function mintPrice() view returns (uint256)",
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "uint256", name: "sent", type: "uint256" },
      { internalType: "uint256", name: "required", type: "uint256" },
    ],
    name: "InsufficientFunds",
    type: "error",
  },
];

function App() {
  const [userAddress, setUserAddress] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [mintPrice, setMintPrice] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const login = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        alert("MetaMask is not installed. Please install it to continue.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setUserAddress(userAddress);
      setIsLoggedIn(true); // Set the login state
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login failed. Check the console for details.");
    }
  };

  const fetchData = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Fetch ERC20 token balance
      const myTokenContract = new ethers.Contract(myTokenAddress, myTokenAbi, provider);
      const balance = await myTokenContract.balanceOf(userAddress);
      const decimals = await myTokenContract.decimals();
      setTokenBalance(ethers.formatUnits(balance, decimals));

      // Fetch NFT mint price
      const nftContract = new ethers.Contract(nftAddress, nftAbi, provider);
      const price = await nftContract.mintPrice();
      setMintPrice(ethers.formatUnits(price, decimals));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const mintNFT = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const myTokenContract = new ethers.Contract(myTokenAddress, myTokenAbi, signer);
      const nftContract = new ethers.Contract(nftAddress, nftAbi, signer);

      const price = await nftContract.mintPrice();
      const decimals = await myTokenContract.decimals();

      // Approve the NFT contract to spend the user's tokens
      const approveTx = await myTokenContract.approve(nftAddress, price);
      await approveTx.wait();

      // Generate a unique token ID
      const uniqueTokenId = Math.floor(Date.now() / 1000);

      // Mint NFT
      const mintTx = await nftContract.mintWithPayment(userAddress, uniqueTokenId);
      await mintTx.wait();

      alert("NFT minted successfully!");
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Error minting NFT:", err);
      alert("Minting failed: Check the console for details.");
    }
  };

  return (
    <div>
      <h1>MINT</h1>

      {!isLoggedIn ? (
        <button onClick={login}>Login with MetaMask</button>
      ) : (
        <>
          <p>Your Address: {userAddress}</p>
          <p>MyToken Balance: {tokenBalance} MTK</p>
          <p>NFT Mint Price: {mintPrice} MTK</p>

          <div>
            <h2>Mint NFT</h2>
            <button onClick={mintNFT}>Mint NFT</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
