const { assert } = require("chai");
const { network, deployments, ethers } = require("hardhat");
// const {developmentChains} = require("")

!developmentChains.includes(network.name)
	? describe.skip
	: describe("Basic Nft Unit Test", async function () {
			let basicNft, deployer;

			beforeEach(async () => {
				accounts = await ethers.getSigners();
				deployer = accounts[0];
				await deployments.fixture(["mocks", "basicnft"]);
				basicNft = await ethers.getContract("BasicNft");
			});

			it("allows users to mint an Nft and updates appropriately", async () => {
				const txResponse = await basicNft.mintNft();
				await txResponse.wait(1);
				const tokenURI = await basicNft.tokenURI(0);
				const tokenCounter = await basicNft.getTokenCounter();

				assert.equal(tokenCounter.toString(), "1");
				assert.equal(tokenURI, await basicNft.TOKEN_URI());
			});
	  });
