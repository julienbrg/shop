// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Shop is ERC721Holder {

    address public addr;
    uint public id;
    uint public price;
    address public beneficiary;
    bool public open;

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
        open = true;
    }

    function buy() public payable {
        require(msg.value >= price, "Not enough");
        require(open == true, "Not open");
        open = false;
        payable(beneficiary).transfer(msg.value);
        IERC721(addr).safeTransferFrom(address(this), msg.sender, id);
    }

    receive() external payable {
        buy();
        if (open == true) {
            payable(msg.sender).transfer(msg.value - price);
        } else {
            payable(msg.sender).transfer(msg.value);
        }
    }
}