pragma solidity >=0.4.21 <0.6.0;

// Based on the solidity docs for common patterns: https://solidity.readthedocs.io/en/v0.5.0/common-patterns.html?highlight=seller
contract Owned {
    /**
     * Constructor
     * Sets the message sender as the seller
     */
    constructor() public { seller = msg.sender; }
    bool public contractRetracted = false;
    uint public creationTime = now;
    address payable public seller;
    address payable public buyer;
    address public intermediator;
    bool public contractIsClosed = false;

    /**
     * Disown
     * Disown current seller
     * Prerequisite: Seller and contractRetracted == false
     */
    function disown()
        public
        onlyBy(seller)
        contractIsRetracted(false)
    {
        delete seller;
    }

    /**
     * Change Seller
     * Prerequisite: Seller and contractRetracted == false
     */
    // function changeSeller(address payable _newSeller)
    //     public
    //     onlyBy(seller)
    //     contractIsRetracted(false)
    // {
    //     seller = _newSeller;
    // }

    /**
     * Getter
     * returns { boolean } if contract is retracted
     */
    function getContractRetracted() 
        public
        view
        returns (bool)
    {
        return contractRetracted;
    }

    /**
     * Getter
     * returns { boolean } if contract is closed
     */
    function getIsContractClosed() 
        public
        view
        returns (bool)
    {
        return contractIsClosed;
    }

    /**
     * Getter
     * returns { address } of seller
     */
    function getSeller() 
        public
        view
        returns (address)
    {
        return seller;
    }

    /**
     * Getter
     * returns { address } of buyer
     */
    function getBuyer() 
        public
        view
        returns (address)
    {
        return buyer;
    }

    /**
     * Getter
     * returns { address } of intermediator
     */
    function getIntermediator() 
        public
        view
        returns (address)
    {
        return intermediator;
    }

    /**
     * Getter
     * returns { uint } creationTime
     */
    function getCreationTime() 
        public
        view
        returns (uint)
    {
        return creationTime;
    }

    /**
     * Modifier
     * Only _account is qualified to access function
     */
    modifier onlyBy(address _account) 
    {
        require(
            msg.sender == _account,
            "Sender is not the allowed to perform this action."
        );
        _;
    }

    /**
     * Modifier
     * Only _account is qualified to access function
     */
    modifier onlyBySellerOrBuyer() 
    {
        require(
            (msg.sender == seller) || (msg.sender == buyer),
            "Sender must be seller or buyer of the contract"
        );
        _;
    }

    /**
     * Modifier
     * Only after _time can the function be executed
     */
    modifier onlyAfter(uint _time) {
        require(
            now >= _time,
            "The function is called too early."
        );
        _;
    }

    /**
     * Modifier
     * Check if contract is intact
     */
    modifier contractIntact() {
        require(
            contractIsClosed == false,
            "The contract is closed."
        );
        _;
    }

    /**
     * Modifier
     * Check if msg.sender is member of the contract
     */
    modifier onlyMemberOfContract() {
        require(
            msg.sender == seller || 
            msg.sender == buyer || 
            msg.sender == intermediator
        );
        _;
    }

    /**
     * Modifier
     * Check if contract is retracted
     */
    modifier contractIsRetracted(bool retracted) {
        require(
            contractRetracted == retracted, 
            "Contract does not satisfy the retraction precondition"
        );
        _;
    }
}
