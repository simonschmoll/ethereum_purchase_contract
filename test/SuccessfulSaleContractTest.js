const BigNumber = require('bignumber.js')

const SalesContract = artifacts.require("SalesContract");

contract('Successful Tests for SalesContract', async (accounts) => {
    let instance
    const book = "book"
    var price
    const [seller, buyer, intermediator, randomGuy] = accounts

    beforeEach('Setup of contract', async function () {
        // Given
        instance = await SalesContract.new(buyer, intermediator)
        price = web3.utils.toBN((web3.utils.toWei('1', 'ether')))
    })

    it("Buyer is initialized", async () => {
        // When
        let buyer = await instance.buyer()
        
        // Assert
        assert.strictEqual(buyer, buyer)
    })

    it("Intermediator is initialized", async () => {
        // When
        let intermediator = await instance.intermediator()
        
        // Assert
        assert.strictEqual(intermediator, intermediator);
    })

    it("Seller is initialized", async () => {
        // When
        let seller = await instance.seller()

        // Assert
        assert.strictEqual(seller, seller)
    })

    it("Item is set by seller", async () => {
        // When
        await instance.setItem(book, price);
        let item = await instance.item()
        
        // Then
        assert.strictEqual(item.name, book);
        assert.strictEqual(item.price.toString(), price.toString())
    })

    it("Item is paid by buyer", async () => {
        // Given
        await instance.setItem(book, price)
        
        // When
        await instance.payItem({value: price, from: buyer})
        let item = await instance.item()
        
        // Assert
        assert.strictEqual(item.itemPaid, true)

        // Assert that the contract now has the right balance
        let balance = new BigNumber(await web3.eth.getBalance(instance.address))
        assert.strictEqual(balance.toString(), price.toString())
    })

    it("item is received by buyer", async () => {
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        
        // When
        await instance.itemReceived({from: buyer})
        let item = await instance.item()
        
        // Then
        assert.strictEqual(item.itemReceived, true)
    })

    it("Get contract balance", async () => {
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        
        // When
        let balance = new BigNumber(await instance.getContractBalance())
        
        // Then
        assert.strictEqual(balance.toString(), price.toString())
    })

    it("Withdraw money by seller", async () => {
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        await instance.itemReceived({from: buyer})
        
        // When
        let balanceBefore = new BigNumber(await web3.eth.getBalance(seller))
        let hash = await instance.withdraw({from: seller});
        let balanceRaw = await web3.eth.getBalance(seller)
        let expectedBalanceAfter = new BigNumber(balanceRaw)
        let tx = hash["tx"]

        let transactionReceipt = await web3.eth.getTransactionReceipt(tx)
        let gasUsed = transactionReceipt.gasUsed
        let transaction = await web3.eth.getTransaction(tx);
        let gasPrice = transaction.gasPrice
        let gasCost = new BigNumber(gasPrice * gasUsed)
        let actualAfterBalance = balanceBefore.minus(gasCost).plus(price)

        //Then
        assert.strictEqual(actualAfterBalance.toString(), expectedBalanceAfter.toString())
    })
})

