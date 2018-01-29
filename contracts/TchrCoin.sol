pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
import "./ConvertLib.sol";

contract TchrCoin is StandardToken {
  string public constant name = "TchrCoin"; // solium-disable-line uppercase
  string public constant symbol = "TCHR"; // solium-disable-line uppercase
  uint8 public constant decimals = 18; // solium-disable-line uppercase
  uint8 public constant buyPrice = 2; // solium-disable-line uppercase

  uint256 public constant INITIAL_SUPPLY = 10000;

	function TchrCoin() public {
    totalSupply_ = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
    Transfer(0x0, msg.sender, INITIAL_SUPPLY);
	}

  function buy(uint256 buyAmount) public payable returns (uint amount){
      amount = buyAmount / buyPrice;
      balances[msg.sender] += amount;
      balances[this] -= amount;
      Transfer(this, msg.sender, amount);
      return amount;
  }

	function balanceOfEth(address addr) public view returns(uint){
		return ConvertLib.convert(balanceOf(addr), buyPrice);
	}
}
