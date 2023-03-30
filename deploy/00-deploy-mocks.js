const { developmentChains } = require("../helper-hardhat-config");

module.exports = async function (hre) {
	const { deployments, getNamedAccounts, network, ethers } = hre;

	const BASE_FEE = ethers.utils.parseEther("0.25"); // 0.25 is the premium, it cost 0.25 link per request
	const GAS_PRICE_LINK = 1e9;

	const { deploy, logs } = deployments;
	const { deployer } = await getNamedAccounts();
	const args = [BASE_FEE, GAS_PRICE_LINK];

	if (developmentChains.includes(network.name)) {
		console.log("Local network detected, deploying mocks.....");
		// deploy a vrfCoordinator mock
		await deploy("VRFCoordinatorMock", {
			from: deployer,
			log: true,
			args: args,
		});
		log("Mocks deployed ");
		log("-----------------------------------------------------");
	}
};
module.exports.tags = ["all", "mocks"];
