pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;
import "./Retraction.sol";

contract SalesContract is Retraction {

    event PaidItem(
        address seller,
        address buyer,
        uint price
    );
    event ContractIsSettled(
        address seller,
        address buyer,
        uint price
    );

    event SetItem(
        string name,
        uint price
    );

    struct Item {
        string name;
        uint price;   
        bool itemReceived;
        bool itemPaid;
    }
    Item public item;

    bool public itemIsSet = false;

    /**
     * Constructor
     * Sets the intermediator and the buyer
     */
    constructor(address payable _buyer, address _intermediator) 
        public 
    {
        buyer = _buyer;
        intermediator = _intermediator;
    }

    /**
     * Pay item
     * Modifier: only buyer, contractIntact == true, msg.value == price
     */
    function payItem() 
        public 
        payable 
        onlyBy(buyer) 
        contractIntact()
        contractIsRetracted(false)  
        paymentEqualPrice() 
    {
        item.itemPaid = true;
        emit PaidItem(seller, msg.sender, msg.value);
    }

    /**
     * Item is received
     * If item is received buyer can call this function
     * Modifier: only buyer, itemPaid == true
     */
    function itemReceived() 
        public 
        onlyBy(buyer)
        itemIsPaid() 
    {
        item.itemReceived = true;
    }

    /**
     * Withdraw
     * Seller can withdraw money
     * Modifier: only seller, itemReceived == true, contractIsClosed == true, contractRetracted == false
     */
    function withdraw() 
        public 
        onlyBySellerOrBuyer() 
        contractIntact()
    {
        if(contractRetracted) {
            if(buyerIsPaidBack) {
                require(
                    msg.sender == buyer,
                    "Sender is not the allowed to perform this action."
                );
            } else {
                require(
                    msg.sender == seller,
                    "Sender is not the allowed to perform this action."
                );
            }
            emit WithdrawalFromRetraction(msg.sender, item.price); 
        } else {
            require(
                item.itemReceived == true,
                "Item must be marked as received to withdraw money, please contact the buyer."
            );
            require(
                msg.sender == seller,
                "Sender is not the allowed to perform this action."
            );
        }
        assert(address(this).balance > 0);
        contractIsClosed = true;
        msg.sender.transfer(item.price);
        emit ContractIsSettled(msg.sender, buyer, item.price);
    }

    // /**
    //  * Withdraw after retraction
    //  * Buyer can withdraw money if contract is retracted and he is ruled right
    //  * Modifier: only by buyer, contractRetracted == false, buyerIsPaidBack == true
    //  */
    // function withdrawAfterRetractionByBuyer() 
    //     public
    //     onlyBy(buyer) 
    //     contractIsRetracted(true) 
    //     buyerIsRuledRight(true)
    // {
    //     assert(contractIsClosed == false);
    //     assert(address(this).balance == item.price);
    //     contractIsClosed = true;
    //     msg.sender.transfer(item.price);
    //     emit WithdrawalFromRetraction(msg.sender, item.price);   
    // }

    // /**
    //  * Withdraw after retraction
    //  * Seller can withdraw money if contract is retracted and he is ruled right
    //  * Modifier: only by seller, contractRetracted == false, buyerIsPaidBack == false
    //  */
    // function withdrawAfterRetractionBySeller() 
    //     public
    //     onlyBy(seller) 
    //     contractIsRetracted(true) 
    //     buyerIsRuledRight(false)
    // {
    //     assert(address(this).balance == item.price);
    //     contractIsClosed = true;
    //     msg.sender.transfer(item.price);
    //     emit WithdrawalFromRetraction(msg.sender, item.price);   
    // }

    /**
     * Setter
     * Sets the Item (name, price, default itemPaid, default itemReceived)
     */
    function setItem(string memory _name, uint _price) 
        public 
        onlyBy(seller) 
        itemIsNotSet()
    {
        item.name = _name;
        item.price = _price;
        item.itemPaid = false;
        item.itemReceived = false;
        itemIsSet = true;
        // emit SetItem(_name, _price);
    }

    /**
     * Getter
     * Get the current Item
     */
    function getItem()
        public
        view
        returns (Item memory i)
    {
        return item;
    }

    /**
     * Getter
     * Get Status if item is received
     */
    function getItemReceivedStatus()
        public
        view
        returns (bool)
    {
        return item.itemReceived;
    }

    /**
     * Getter
     * Get Balance of contract
     * Assertion: Balance must be null or price of item
     */
    function getContractBalance() public view returns (uint) {
        assert(address(this).balance == 0 || address(this).balance == item.price);
        return address(this).balance;
    }

    /**
     * Modifier
     * Check if item is paid
     */
    modifier itemIsPaid() 
    {
        require(
            item.itemPaid == true, 
            "Item not paid"
            );
        _;
    }

    /**
     * Modifier
     * Check if item is received
     */
    modifier itemIsReceived() 
    {
        require(
            item.itemReceived == true, 
            "Item not received"
            );
        _;
    }

    /**
     * Modifier
     * Check if value of msg sender is equal to price of item
     */
    modifier paymentEqualPrice() 
    {
        require(
            msg.value == item.price, 
            "The paid amount was not equal to the listed price of the item"
            );
        _;
    }

    /**
     * Modifier
     * Check if value of msg sender is equal to price of item
     */
     modifier itemIsNotSet()
     {
        require(
            itemIsSet == false, 
            "Item can only be set once"
            );
        _;
     }
}
