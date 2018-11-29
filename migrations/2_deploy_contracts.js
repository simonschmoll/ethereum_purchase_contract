var SalesContract = artifacts.require("./SalesContract.sol");

module.exports = function(deployer) {
  deployer.deploy(SalesContract, "0x5226dd644fdfd02f8a9e6a34eb6a91a2e328f813", "0x3a2910a51028d14f13865527d2df825635d69962");
};
