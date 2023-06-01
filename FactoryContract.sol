// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


// Factory contract
contract FactoryContract {
    address[] public deployedContracts;

    function createContract(uint256 initialValue) public {
        address newContract = address(new ChildContract(initialValue));
        deployedContracts.push(newContract);
    }

    function getDeployedContracts() public view returns (address[] memory) {
        return deployedContracts;
    }
}
// Child contract
contract ChildContract {
    uint256 public value;

    constructor(uint256 initialValue) {
        value = initialValue;
    }

    function increment(uint256 amount) public {
        value += amount;
    }
}