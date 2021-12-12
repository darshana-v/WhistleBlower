// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WhistlerBlower is ERC20 {
	uint256 public _totalSupply = 10000000;
	uint256 public initialSupply = 1000000;
	address public deployer;

	constructor() ERC20("WhistlerBlower", "WHB") {
		deployer = msg.sender;
		_mint(msg.sender, initialSupply);
	}

	function myBalance() external view returns (uint256) {
		return balanceOf(msg.sender);
	}

	function mint(address _to, uint256 _amount) external {
		require(msg.sender == deployer, "only admin can mint tokens");
		_mint(_to, _amount);
	}

	function burn(uint256 _amount) external {
		_burn(msg.sender, _amount);
	}
}
