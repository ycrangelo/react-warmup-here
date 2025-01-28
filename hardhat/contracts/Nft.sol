// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NFT is ERC721, ERC721Burnable, Ownable {
    IERC20 public paymentToken; // Reference to the ERC20 token for payment
    uint256 public mintPrice; // Price for minting an NFT in ERC20 tokens

    constructor(
        address initialOwner,
        address _paymentToken,
        uint256 _mintPrice
    )
        ERC721("NFT", "NFT") // Changed name to "NFT" and symbol to "NFT"
        Ownable(initialOwner)
    {
        paymentToken = IERC20(_paymentToken); // Set the ERC20 token address
        mintPrice = _mintPrice; // Set the minting price
    }

    // Mint function that allows users to pay with ERC20 token
    function mintWithPayment(address to, uint256 tokenId) public {
        require(
            paymentToken.transferFrom(msg.sender, address(this), mintPrice),
            "Payment failed"
        );
        _safeMint(to, tokenId);
    }

    // Function to withdraw ERC20 tokens from the contract
    function withdraw(uint256 amount) public onlyOwner {
        require(paymentToken.transfer(msg.sender, amount), "Withdrawal failed");
    }
}
