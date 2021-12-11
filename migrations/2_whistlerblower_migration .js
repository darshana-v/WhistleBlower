const WhistlerBlower = artifacts.require("whistlerblower");

module.exports = function (deployer) {
  deployer.deploy(WhistlerBlower);
};
