// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Shop is ERC721Holder, Ownable, ReentrancyGuard {

    address public addr;
    uint public id;
    uint public price;
    address public beneficiary;

    constructor (
        address _addr, 
        uint _id 
        ) 
    {
        addr = _addr;
        id = _id;
    }

    function sell(uint _price, address _beneficiary) public payable {
        price = _price;
        beneficiary = _beneficiary;
        IERC721(addr).safeTransferFrom(msg.sender,address(this),id);
        transferOwnership(msg.sender);
    }

    function buy() public payable nonReentrant {
        require(msg.value >= price, "Not enough");
        payable(beneficiary).transfer(price);
        IERC721(addr).safeTransferFrom(address(this), msg.sender, id);
        payable(msg.sender).transfer(msg.value - price);
    }

    function withdraw() public payable onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    receive() external payable {}

    fallback() external payable {}
}