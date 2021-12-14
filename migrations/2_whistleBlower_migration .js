const WhistleBlower = artifacts.require("whistleBlower");

module.exports = function (deployer) {
  deployer.deploy(WhistleBlower);
};
