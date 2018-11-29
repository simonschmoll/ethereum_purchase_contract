pragma solidity ^0.5;

// Based on the solidity docs for common patterns: https://solidity.readthedocs.io/en/v0.5.0/common-patterns.html?highlight=seller
contract Owned {
    constructor() public { seller = msg.sender; }
    uint public creationTime = now;
    address payable public seller;
    address payable public buyer;
    address public intermediator;
    bool contractClosed = false;
    
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
            contractClosed == false,
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

    function disown()
        public
        onlyBy(seller)
    {
        delete seller;
    }

    function changeSeller(address payable _newSeller)
        public
        onlyBy(seller)
    {
        seller = _newSeller;
    }
}
