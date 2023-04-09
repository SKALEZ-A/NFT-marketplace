const { ethers, network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts }) => {
	const deployer = await getNamedAccounts();

	// BASIC NFT
	const basicNft = await ethers.getContract("BasicNft", deployer);
	const basicMintTx = await basicNft.mintNft();
	await basicMintTx.wait(1);
	console.log(`Basic Nft index 0 has TokenUri: ${await basicNft.tokenURI(0)}`);

	// RANDOM IPFS NFT
	const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer);
	const mintFee = await randomIpfsNft.getMintFee();

	await new Promise(async (resolve, reject) => {
		setTimeout(resolve, 300000); // 5 minutes
		randomIpfsNft.once("NftMinted", async () => {
			resolve();
		});
		const randomIpfsNftMintTx = await randomIpfsNft.requestNft({
			value: mintFee.toString(),
		});
		const randomIpfsNftMintTxReceipt = await randomIpfsNft.wait(1);
		if (developmentChains.includes(network.name)) {
			const requestId =
				randomIpfsNftMintTxReceipt.events[1].args.requestId.toString();

			const vrfCoordinatorV2Mock = await ethers.getContract(
				"VrfCoordinatorV2Mock",
				deployer
			);
			await vrfCoordinatorV2Mock.fulfillRandomWords(
				requestId,
				randomIpfsNft.address
			);
		}
	});
	console.log(
		`random IPFS Nft index 0 tokenUri: ${await randomIpfsNft.tokenURI(0)} `
	);
};
