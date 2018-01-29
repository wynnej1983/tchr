var ConvertLib = artifacts.require("./ConvertLib.sol");
var TchrCoin = artifacts.require("./TchrCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, TchrCoin);
  deployer.deploy(TchrCoin);
};
