pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;
import "./Owned.sol";

contract Retraction is Owned {
    struct Agreement {
        bool sellerRetract;
        bool buyerRetract;
        bool intermediatorRetract;
    }
    bool public buyerIsPaidBack;
    Agreement public agreement;

    event WithdrawalFromRetraction(
        address retractor,
        uint price
    );  
    
    /**
     * Constructor
     * Sets the values of the agreement to zero
     */
    constructor () public {
        agreement.sellerRetract = false;
        agreement.buyerRetract = false;
        agreement.intermediatorRetract = false;
    }

    /**
     * Retract Contract
     * Modifier: only seller or buyer, contractRetracted == false, contractClosed == false
     */
    function retractContract() 
        public 
        onlyBySellerOrBuyer()
        contractIsRetracted(false)
        contractIntact()
    {
        if(msg.sender == seller) {
            agreement.sellerRetract = true;
        } else if (msg.sender == buyer) {
            agreement.buyerRetract = true;     
        } 
    }

    /**
     * Finalize Retraction
     * Modifier: only intermediator, contractRetracted == false, contractClosed == false
     */
    function finalizeRetraction(bool buyerIsRight)
        public
        onlyBy(intermediator)
        contractIsRetracted(false)
        contractIntact()
        markedAsRetracted()
    {
        agreement.intermediatorRetract = true;
        if(address(this).balance == 0) {
            contractIsClosed = true;
        } else {
            buyerIsPaidBack = buyerIsRight;
        }
        contractRetracted = true;
    }

    /**
     * Getter
     * returns { struct Agreement }
     */
    function getAgreement()
        public 
        view
        returns (Agreement memory a)
    {
        return agreement;
    }

    /**
     * Getter
     * returns { boolean } if buyer is paid back
     */
    function getBuyerIsPaidBack()
        public
        view
        returns (bool)
    {
        return buyerIsPaidBack;
    }

    /**
     * Modifier
     * Check if buyer is allowed to withdraw money
     */
    modifier buyerIsRuledRight(bool ruling) {
        require(
            buyerIsPaidBack == ruling,
            ruling ? 
            "Buyer can not withdraw money" : 
            "Seller can not withdraw money"
        );
        _;
    }

    /**
     * Modifier
     * Check if intermediator is allowed to call finalizeRetraction
     */
    modifier markedAsRetracted() {
        require(
            agreement.sellerRetract || agreement.buyerRetract,
            "Can only be called if either buyer or seller retract"
        );
        _;
    }
}