// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Shop is ERC721Holder {

    address public addr;
    uint public id;
    uint public price;
    address public beneficiary;

    constructor (
        address _addr, 
        uint _id, 
        uint _price, 
        address _beneficiary
        ) 
    {
        addr = _addr;
        id = _id;
        price = _price;
        beneficiary = _beneficiary;
    }

    function sell() public payable {
        IERC721(addr).safeTransferFrom(msg.sender,address(this),id);
    }

    function buy() public payable {
        require(msg.value >= price, "Not enough");
        payable(beneficiary).transfer(msg.value);
        IERC721(addr).safeTransferFrom(address(this), msg.sender, id);
        payable(msg.sender).transfer(price - msg.value);
    }

    receive() external payable {
        buy();
    }
}