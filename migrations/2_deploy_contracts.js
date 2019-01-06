var SalesContract = artifacts.require("./SalesContract.sol");

module.exports = function(deployer) {
  deployer.deploy(SalesContract, "0xbf8f723E3ceFB60760F4De122E1c38212BC9E6DE", "0xD8032D9C8691150d8bBB83B2AB8348feab23c0C3");
};
