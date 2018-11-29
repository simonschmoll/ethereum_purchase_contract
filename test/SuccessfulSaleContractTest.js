const BigNumber = require('bignumber.js')

const SalesContract = artifacts.require("SalesContract");

contract('Successful Tests for SalesContract', async (accounts) => {
    let instance
    const book = "book"

    // TODO: Why is passing of bigger price a problem? 
    var price = 1e+15

    beforeEach('Setup of contract', async function () {
        // When
        instance = await SalesContract.new(accounts[1], accounts[2])
    })

    it("Buyer is initialized", async () => {
        // When
        let buyer = await instance.buyer()
        
        // Assert
        assert.equal(buyer, accounts[1])
    })

    it("Intermediator is initialized", async () => {
        // When
        let intermediator = await instance.intermediator()
        
        // Assert
        assert.equal(intermediator, accounts[2]);
    })

    it("Seller is initialized", async () => {
        // When
        let seller = await instance.seller()

        // Assert
        assert.equal(seller, accounts[0])
    })

    it("Item is set by seller", async () => {
        // When
        await instance.setItem(book, price);
        let item = await instance.item()
        
        // Then
        assert.equal(item.name, book);
        assert.equal(item.price, price)
    })

    it("Item is paid by buyer", async () => {
        // Then
        await instance.setItem(book, price)
        
        // When
        await instance.payItem({value: price, from: accounts[1]})
        let item = await instance.item()
        
        // Assert
        assert.equal(item.itemPaid, true)

        // Assert that the contract now has the right balance
        let balance = await web3.eth.getBalance(instance.address)
        assert.equal(balance, price)
    })

    it("item is received by buyer", async () => {
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: accounts[1]})
        
        // When
        await instance.itemReceived({from: accounts[1]})
        let item = await instance.item()
        
        // Then
        assert.equal(item.itemReceived, true)
    })

    it("Get contract balance", async () => {
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: accounts[1]})
        
        // When
        let balance = await instance.getContractBalance()
        
        // Then
        assert.equal(balance, price)
    })

    it("Withdraw money by seller", async () => {
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: accounts[1]})
        await instance.itemReceived({from: accounts[1]})
        
        // When
        let balanceBeforeasdasd = await web3.eth.getBalance(accounts[0])
        let balanceBefore = new BigNumber(balanceBeforeasdasd)
        let hash = await instance.withdraw({from: accounts[0]});
        let balanceRaw = await web3.eth.getBalance(accounts[0])
        let expectedBalanceAfter = new BigNumber(balanceRaw)
        let tx = hash["tx"]

        let transactionReceipt = await web3.eth.getTransactionReceipt(tx)
        let gasUsed = transactionReceipt.gasUsed
        let transaction = await web3.eth.getTransaction(tx);
        let gasPrice = transaction.gasPrice
        let gasCost = new BigNumber(gasPrice * gasUsed)
        let actualAfterBalance = balanceBefore.minus(gasCost).plus(price)

        //Then
        assert.equal(actualAfterBalance.toNumber(), expectedBalanceAfter.toNumber())
        // console.log(transaction)
    })
})

