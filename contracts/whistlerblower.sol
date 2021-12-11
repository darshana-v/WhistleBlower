// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10 <0.9.0;

contract whistlerblower {
	constructor() {
		callMe();
	}

	function callMe() public pure returns (string memory) {
		return "Hello World!";
	}
}
