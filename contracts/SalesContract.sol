pragma solidity ^0.5;
import "./owned.sol";

contract SalesContract is owned {

    event ItemIsPaid(
        address seller,
        address buyer,
        uint price
    );
    event ContractSettled(
        address seller,
        address buyer,
        uint price
    );
    address payable public buyer;
    address public intermediator;
    struct Item {
        string name;
        uint price;   
        bool itemReceived;
        bool itemPaid;
    }
    Item item;

    // constructor(address payable _buyer, address _intermediator) public {
    //     buyer = _buyer;
    //     intermediator = _intermediator;
    // }

    function setItem(string memory _name, uint _price) public onlyBy(seller) {
        item.name = _name;
        item.price = _price;
        item.itemPaid = false;
        item.itemReceived = false;
    }
    
    function payItem() public payable onlyBy(buyer) contractIntact() {
        require(msg.value == item.price , "The paid amount was not equal to the listed price of the item");
        item.itemPaid == true;
        item.price == msg.value;
        emit ItemIsPaid(seller, msg.sender, msg.value);
    }

    function itemReceived() public onlyBy(buyer) contractIntact() {
        item.itemReceived = true;
    }

    function withdraw() public onlyBy(seller) contractIntact() {
        require(item.itemPaid == true);
        require(item.itemReceived == true);
        contractClosed = true;
        msg.sender.transfer(item.price);
        emit ContractSettled(msg.sender, buyer, item.price);
    }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }
}
