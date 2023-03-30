// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

pragma solidity ^0.8.7;

contract BasicNft is ERC721 {
	uint256 private s_tokenCounter;
	string public constant TOKEN_URI =
		"ipfs://QmNrmi3Yp5yqsWrqaVWobKuBheucZrMgRJuJobHjNuBfNV?filename=skalez_logo.png";

	constructor() ERC721("SkalezNft", "SNFT") {
		s_tokenCounter = 0;
	}

	function mintNft() public returns (uint256) {
		_safeMint(msg.sender, s_tokenCounter);
		s_tokenCounter += 1;
		return s_tokenCounter;
	}

	function tokenURI(
		uint256 /*tokenId*/
	) public view override returns (string memory) {
		return TOKEN_URI;
	}

	function getTokenCounter() public view returns (uint256) {
		return s_tokenCounter;
	}
}
