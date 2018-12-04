pragma solidity ^0.5;
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
    
    constructor () public {
        agreement.sellerRetract = false;
        agreement.buyerRetract = false; 
        agreement.intermediatorRetract = false;  
    }

    function retractContract() 
        public 
        onlyMemberOfContract()
        contractIsRetracted(false)
        contractIntact()
    {
        if(msg.sender == seller) {
            agreement.sellerRetract = true;
        } else if (msg.sender == buyer) {
            agreement.buyerRetract = true;
        } else if(msg.sender == intermediator) {
            agreement.intermediatorRetract = true;
        } 
        if((agreement.sellerRetract && agreement.buyerRetract) || 
            (agreement.sellerRetract && agreement.intermediatorRetract) ||
            (agreement.buyerRetract && agreement.intermediatorRetract)) {
            if(address(this).balance == 0) {
                contractIsClosed = true;
            } else {
                buyerIsPaidBack = !(agreement.sellerRetract && agreement.intermediatorRetract);
            }
            contractRetracted = true;
        }
    }

    modifier buyerIsRuledRight(bool ruling) {
        require(
            buyerIsPaidBack == ruling,
            ruling ? 
            "Buyer can not withdraw money" : 
            "Seller can not withdraw money"
        );
        _;
    }
}