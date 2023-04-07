const { assert, expect } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

const lowSVGImageuri = "data:image/svg+xml;base64,/*imageUri*/";
const highSVGimageUri = "data:image/svg+xml;base64,";

const highTokenUri = "data:application/json;base64,";
const lowTokenUri = "data:application/json;base64,";

!developmentChains.includes(network.name)
	? describe.skip
	: describe("Dynamic SVG NFT Unit Tests", function () {
			let dynamicSvgNft, deployer, mockV3Aggregator;

			beforeEach(async () => {
				accounts = await ethers.getSigners();
				deployer = accounts[0];
				await deployments.fixture([mocks, dynamicsvg]);
				dynamicSvgNft = await ethers.getContract("DynamicSvgNft");
				mockV3Aggregator = await ethers.getContract("MockV3Aggregator");
			});

			describe("constructor", () => {
				it("sets starting values correctly", async () => {
					const lowSVG = await dynamicSvgNft.getLowSVG();
					const highSVG = await dynamicSvgNft.getHighSVG();
					const priceFeed = await dynamicSvgNft.getPriceFeed();
					assert.equal(lowSVG, lowSVGImageuri);
					assert.equal(highSVG, highSVGimageUri);
					assert.equal(priceFeed, mockV3Aggregator.address);
				});
			});

			describe("mintNft", () => {
				it("emits an event and creates the Nft", async () => {
					const highValue = ethers.utils.parseEther("1"); // 1 dollar per ether
					await expect(dynamicSvgNft.mintNft(highValue)).to.emit(
						dynamicSvgNft,
						"CreatedNFT"
					);
					const tokenCounter = await dynamicSvgNft.getTokenCounter();
					assert.equal(tokenCounter.toString(), "1");
					const tokenURI = await dynamicSvgNft.tokenURI(0);
					assert.equal(tokenURI, highTokenUri);
				});
				it("shifts the tokenuri to lower when the price doesnt surpass the highValue", async () => {
					const highValue = ethers.utils.parseEther("100000000"); // $100,000,000 dollar per ether.
					const txResponse = dynamicSvgNft.mintNft(highValue);
					await txResponse.wait(1);
					const tokenURI = await dynamicSvgNft.tokenURI(0);
					assert.equal(tokenURI, lowTokenUri);
				});

				// probably want more tests checking the svg -> token URI conversion svgToImageURI
				// More coverage of course
				// Maybe some tokenURI oddities
			});
	  });
