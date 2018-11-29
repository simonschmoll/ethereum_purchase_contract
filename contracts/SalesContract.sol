pragma solidity ^0.5;
import "./Retraction.sol";

contract SalesContract is Retraction {

    event PaidItem(
        address seller,
        address buyer,
        uint price
    );
    event ContractSettled(
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

    constructor(address payable _buyer, address _intermediator) public {
        buyer = _buyer;
        intermediator = _intermediator;
    }

    function setItem(string memory _name, uint _price) public onlyBy(seller) {
        item.name = _name;
        item.price = _price;
        item.itemPaid = false;
        item.itemReceived = false;
    }
    
    function payItem() public payable onlyBy(buyer) contractIntact() {
        require(msg.value == item.price, "The paid amount was not equal to the listed price of the item");
        item.itemPaid = true;
        emit PaidItem(seller, msg.sender, msg.value);
    }

    function itemReceived() public onlyBy(buyer) contractIntact() itemIsPaid() {
        item.itemReceived = true;
    }

    function withdraw() public onlyBy(seller) contractIntact() itemIsPaid() itemIsReceived() {
        contractClosed = true;
        msg.sender.transfer(item.price);
        emit ContractSettled(msg.sender, buyer, item.price);
    }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    modifier itemIsPaid() {
        require(item.itemPaid == true, "Item not paid");
        _;
    }

    modifier itemIsReceived() {
        require(item.itemReceived == true, "Item not received");
        _;
    }
}
