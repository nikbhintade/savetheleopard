// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Savetheleopard is ERC721Enumerable, Ownable {

    uint32 MAX_SUPPLY = 14000;
    uint8 MAX_MINT = 10; // MAX number for NFT minted per transaction
    uint PRICE = 50000000000000000; // Price of one NFT

    // initializing contract
    constructor() ERC721("SaveTheLeopard", "SLT") {
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return "https://github.com/testRepo/";
    }

    function mint(uint number) payable public {
        // totalSupply of NFTs should be less than MAX_SUPPLY
        require(totalSupply() < MAX_SUPPLY, "no more minting");
        // User can't mint more than MAX_MINT amount in single transaction
        require(number < MAX_MINT, "no more than 10");
        // sent value should be more than or equal to  number * PRICE
        require(SafeMath.mul(number, PRICE) <= msg.value, "insufficient funds");

        // Mint x number of NFTs
        for(uint i = 0; i< number; i++){
            // _safemint take 2 argument 
            // 1st: address of person minting
            // 2nd: id for that NFT (totalSupply() returns total number of NFTs in the contract)
            _safeMint(msg.sender, totalSupply());
        }
    }
}