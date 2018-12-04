pragma solidity ^0.5.0;

// Based on the solidity docs for common patterns: https://solidity.readthedocs.io/en/v0.5.0/common-patterns.html?highlight=seller
contract Owned {
    constructor() public { seller = msg.sender; }
    bool public contractRetracted = false;
    uint public creationTime = now;
    address payable public seller;
    address payable public buyer;
    address public intermediator;
    bool public contractIsClosed = false;
    
    modifier onlyBy(address _account) 
    {
        require(
            msg.sender == _account,
            "Sender is not the allowed to perform this action."
        );
        _;
    }

    modifier onlyAfter(uint _time) {
        require(
            now >= _time,
            "The function is called too early."
        );
        _;
    }

    modifier contractIntact() {
        require(
            contractIsClosed == false,
            "The contract is closed."
        );
        _;
    }

    modifier onlyMemberOfContract() {
        require(
            msg.sender == seller || 
            msg.sender == buyer || 
            msg.sender == intermediator
        );
        _;
    }

    modifier contractIsRetracted(bool retracted) {
        require(
            contractRetracted == retracted, 
            "Contract does not satisfy the retraction precondition"
        );
        _;
    }

    function disown()
        public
        onlyBy(seller)
        contractIsRetracted(false)
    {
        delete seller;
    }

    function changeSeller(address payable _newSeller)
        public
        onlyBy(seller)
        contractIsRetracted(false)
    {
        seller = _newSeller;
    }
}
