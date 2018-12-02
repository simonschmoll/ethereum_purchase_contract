pragma solidity ^0.5;
import "./Owned.sol";

contract Retraction is Owned {
    bool public contractRetracted = false;
    struct Agreement {
        bool sellerRetract;
        bool buyerRetract;
        bool intermediatorRetract;
    }
    Agreement public agreement;
    bool public contractRetractedByRuling = false;

    event withdrawlFromRetraction(
        address buyer,
        uint price
    );  
    
    constructor () public {
        agreement.sellerRetract = false;
        agreement.buyerRetract = false; 
        agreement.intermediatorRetract = false;  
    }

    function disputeRuling() 
        public
        onlyBy(intermediator)
        contractIntact()
    {
        contractRetractedByRuling = true;
    }

    function retractContract() 
        public 
        onlyMemberOfContract() 
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
            }
            contractRetracted = true;
        }
    }

    modifier contractIsRetracted() {
        require(
            contractRetracted == true, 
            "Contract is not retracted"
        );
        _;
    }
}