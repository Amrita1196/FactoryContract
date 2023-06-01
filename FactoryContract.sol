// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


// Factory contract
contract FactoryContract {
    ChildContract[] public deployedContracts;

    function createContract(uint256 initialValue) public {
        ChildContract newContract = new ChildContract(initialValue);
        deployedContracts.push(newContract);
        return deployedContracts;
    }

    function getDeployedContracts() public view returns (ChildContract[] memory) {
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