pragma solidity ^0.5;
import "./Retraction.sol";

contract SalesContract is Retraction {

    event PaidItem(
        address seller,
        address buyer,
        uint price
    );
    event contractIsSettled(
        address seller,
        address buyer,
        uint price
    );

    struct Item {
        string name;
        uint price;   
        bool itemReceived;
        bool itemPaid;
    }
    Item public item;

    constructor(address payable _buyer, address _intermediator) 
        public 
    {
        buyer = _buyer;
        intermediator = _intermediator;
    }

    function setItem(string memory _name, uint _price) 
        public 
        onlyBy(seller) 
    {
        item.name = _name;
        item.price = _price;
        item.itemPaid = false;
        item.itemReceived = false;
    }
    
    function payItem() 
        public 
        payable 
        onlyBy(buyer) 
        contractIntact() 
        paymentEqualPrice() {
        item.itemPaid = true;
        emit PaidItem(seller, msg.sender, msg.value);
    }

    function itemReceived() 
        public 
        onlyBy(buyer)
        itemIsPaid() 
    {
        item.itemReceived = true;
    }

    function withdraw() 
        public 
        onlyBy(seller) 
        contractIntact() 
        itemIsReceived() 
    {
        contractIsClosed = true;
        msg.sender.transfer(item.price);
        emit contractIsSettled(msg.sender, buyer, item.price);
    }

    function withdrawAfterRetraction() 
        public
        onlyBy(buyer) 
        contractIsRetracted() 
        contractIntact()
    {
        contractIsClosed = true;
        msg.sender.transfer(item.price);
        emit withdrawlFromRetraction(msg.sender, item.price);   
    }

// Todo: After ruling withdraw money (seller)
    // function withdrawMoneyAfterRuling() 
    //     public
    //     onlyBy(seller)

    // {

    // }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    modifier itemIsPaid() 
    {
        require(
            item.itemPaid == true, 
            "Item not paid"
            );
        _;
    }

    modifier itemIsReceived() 
    {
        require(
            item.itemReceived == true, 
            "Item not received"
            );
        _;
    }

    modifier paymentEqualPrice() 
    {
        require(
            msg.value == item.price, 
            "The paid amount was not equal to the listed price of the item"
            );
        _;
    }
}
