const { assert, expect } = require("chai");
const { deployments, network, ethers } = require("hardhat");
const {
	developmentChains,
	networkConfig,
} = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
	? describe.skip
	: describe("Random IPFS Unit tests"),
	async function () {
		let randomIpfsNft, deployer, vrfCoordinatorV2Mock;

		beforeEach(async () => {
			accounts = await ethers.getSigners();
			deployer = accounts[0];
			await deployments.fixture(["mocks", "randomipfs"]);
			randomIpfsNft = await ethers.getContract("RandomIpfsNft");
			vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
		});

		describe("Constructor", () => {
			it("sets starting values correctly", async () => {
				const dogTokenUriZero = await randomIpfsNft.getDogTokenUris(0);
				assert(dogTokenUriZero.includes("ipfs://"));
			});
		});
	};
