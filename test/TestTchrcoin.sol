pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/TchrCoin.sol";

contract TestTchrcoin {

  function testInitialBalanceUsingDeployedContract() public {
    TchrCoin tchr = TchrCoin(DeployedAddresses.TchrCoin());

    uint expected = 10000;

    Assert.equal(tchr.getBalance(tx.origin), expected, "Owner should have 10000 TchrCoin initially");
  }

  function testInitialBalanceWithNewTchrCoin() public {
    TchrCoin tchr = new TchrCoin();

    uint expected = 10000;

    Assert.equal(tchr.getBalance(tx.origin), expected, "Owner should have 10000 TchrCoin initially");
  }

}
