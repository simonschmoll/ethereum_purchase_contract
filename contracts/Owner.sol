pragma solidity ^0.5;

contract SalesContract {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }
}
