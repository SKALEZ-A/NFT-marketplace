const { network } = require("hardhat");
const { deploymentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
	const { deploy, logs } = deployments;
	const { deployer } = await getNamedAccounts();

	log("------------ getting started -------------");
	const args = [];
	const basicNft = await deploy("BasicNft", {
		from: deployer,
		args: args,
		log: true,
		waitConfirmations: network.config.blockConfirmations || 1,
	});

	if (
		!developmentChains.includes(network.name) &&
		process.env.ETHERSCAN_API_KEY
	) {
		log("Verifying.....");
		await verify(basicNft.address, args);
	}
	log("-------------------------------------------");
};
