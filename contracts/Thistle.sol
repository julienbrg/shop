// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Thistle is ERC721, ERC721URIStorage {

	constructor() ERC721("Thistle", "THI") 
    {
        _safeMint(msg.sender, 1);
        _setTokenURI(1, "https://ipfs.io/ipfs/bafkreieonh2tbxhmjpikglkqzhbfvym4zzzwrz4iqtistjwbreyzcswroa");
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) 
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
