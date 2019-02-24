const BigNumber = require('bignumber.js')
const truffleAssert = require('truffle-assertions');

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

/***********************************************************************************
 Buyer initialized test
/**********************************************************************************/
    
    it("Buyer is initialized", async () => {
        // When
        let buyer = await instance.buyer()
        
        // Assert
        assert.strictEqual(buyer, buyer, "Initialized buyer should be specified buyer")
    })

/***********************************************************************************
 Intermediator initialized test
/**********************************************************************************/
    it("Intermediator is initialized", async () => {
        // When
        let intermediator = await instance.intermediator()
        
        // Assert
        assert.strictEqual(intermediator, intermediator, "Initialized intermediator should be specified intermediator");
    })

/***********************************************************************************
 Seller intialized test
/**********************************************************************************/
    
    it("Seller is initialized", async () => {
        // When
        let seller = await instance.seller()

        // Assert
        assert.strictEqual(seller, seller, "Initialized seller should be specified seller")
    })

/***********************************************************************************
 setItem() test
/**********************************************************************************/
    
    it("Item is set by seller", async () => {
        // When
        await instance.setItem(book, price);
        let item = await instance.item()
        let itemSet = await instance.itemIsSet()

        // Then
        assert.strictEqual(item.name, book, "Set book should be specified book");
        assert.strictEqual(item.price.toString(), price.toString(), "Set price should be specified price")
        assert.strictEqual(item.itemPaid, false, "itempaid should be false")
        assert.strictEqual(item.itemReceived, false, "itemReceived should be false")
        assert.strictEqual(itemSet, true, "itemSet should be true")
    })

/***********************************************************************************
 payItem() test
/**********************************************************************************/
    
    it("Item is paid by buyer", async () => {
        // Given
        await instance.setItem(book, price)
        
        // When
        await instance.payItem({value: price, from: buyer})
        let item = await instance.item()
        
        // Assert
        assert.strictEqual(item.itemPaid, true, "itemPaid should be true")

        // Assert that the contract now has the right balance
        let balance = new BigNumber(await web3.eth.getBalance(instance.address))
        assert.strictEqual(balance.toString(), price.toString(), "Balance should b amount of price")

    })

/***********************************************************************************
 itemReceived() test
/**********************************************************************************/
    
    it("item is received by buyer", async () => {
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        
        // When
        await instance.itemReceived({from: buyer})
        let item = await instance.item()
        
        // Then
        assert.strictEqual(item.itemReceived, true, "itemReceived should be true")
    })

/***********************************************************************************
 getContractBalance() test
/**********************************************************************************/
    
    it("Get contract balance", async () => {
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        
        // When
        let balance = new BigNumber(await instance.getContractBalance())
        
        // Then
        assert.strictEqual(balance.toString(), price.toString(), "Balance should be equal to price")
    })


/***********************************************************************************
 withdraw() test
/**********************************************************************************/
    
    it("Withdraw money by seller", async () => {
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        await instance.itemReceived({from: buyer})
        let balanceContractBefore = new BigNumber(await web3.eth.getBalance(instance.address))

        // When
        let balanceSellerBefore = new BigNumber(await web3.eth.getBalance(seller))
        let hash = await instance.withdraw({from: seller})
        let balanceRaw = await web3.eth.getBalance(seller)
        let expectedBalanceSellerAfter = new BigNumber(balanceRaw)
        let tx = hash["tx"]

        let transactionReceipt = await web3.eth.getTransactionReceipt(tx)
        let gasUsed = transactionReceipt.gasUsed
        let transaction = await web3.eth.getTransaction(tx);
        let gasPrice = transaction.gasPrice
        let gasCost = new BigNumber(gasPrice * gasUsed)
        let actualAfterBalanceSeller = balanceSellerBefore.minus(gasCost).plus(price)

        // Should not be necessary? Normally web3 returns bigNumber
        let balanceContractAfter = new BigNumber(await web3.eth.getBalance(instance.address))

        //Then
        assert.strictEqual(actualAfterBalanceSeller.toString(), expectedBalanceSellerAfter.toString(), "Seller should have more money after deal (+ price)")
        assert.strictEqual(balanceContractBefore.toString(), price.toString(), "Balance before withdraw should be equal to price")
        assert.strictEqual(balanceContractAfter.toString(), '0', "Balance after should be 0")
        assert.strictEqual(await instance.contractIsClosed(), true, "Contract should be closed")

    })

/***********************************************************************************
 withdrawAfterRetractionByBuyer() test
/**********************************************************************************/
    
    it("Withdraw after retraction", async () => {
        // Given 
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        let balanceContractBefore = new BigNumber(await web3.eth.getBalance(instance.address))
        await instance.retractContract({from: buyer})
        await instance.finalizeRetraction(true, {from: intermediator})

        // When 
        let balanceBuyerBefore = new BigNumber(await web3.eth.getBalance(buyer))
        let hash = await instance.withdraw({from: buyer})
        let balanceRaw = await web3.eth.getBalance(buyer)
        let expectedBalanceBuyerAfter = new BigNumber(balanceRaw)
        let tx = hash["tx"]
        let transactionReceipt = await web3.eth.getTransactionReceipt(tx)
        let gasUsed = transactionReceipt.gasUsed
        let transaction = await web3.eth.getTransaction(tx);
        let gasPrice = transaction.gasPrice
        let gasCost = new BigNumber(gasPrice * gasUsed)
        let actualAfterBalanceBuyer = balanceBuyerBefore.minus(gasCost).plus(price)

        // Then
        // Should not be necessary? Normally web3 returns bigNumber
        let balanceContractAfter = new BigNumber(await web3.eth.getBalance(instance.address))
            
        assert.strictEqual(actualAfterBalanceBuyer.toString(), expectedBalanceBuyerAfter.toString(), "Buyer should have less money after deal (- price)")
        assert.strictEqual(balanceContractBefore.toString(), price.toString(), "Balance before withdraw should be equal to price")
        assert.strictEqual(balanceContractAfter.toString(), '0', "Balance after withdraw should be equal to 0")
        assert.strictEqual(await instance.contractIsClosed(), true, "Contract should be closed")
    })

/***********************************************************************************
 withdrawAfterRetractionBySeller tests
/**********************************************************************************/
    
    it("Withdraw money by seller after dispute", async () => {
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        let balanceContractBefore = new BigNumber(await web3.eth.getBalance(instance.address))
        await instance.retractContract({from: seller})
        await instance.finalizeRetraction(false, {from: intermediator})

        // When
        let balanceSellerBefore = new BigNumber(await web3.eth.getBalance(seller))
        let hash = await instance.withdraw({from: seller})
        let balanceRaw = await web3.eth.getBalance(seller)
        let expectedBalanceSellerAfter = new BigNumber(balanceRaw)
        let tx = hash["tx"]

        let transactionReceipt = await web3.eth.getTransactionReceipt(tx)
        let gasUsed = transactionReceipt.gasUsed
        let transaction = await web3.eth.getTransaction(tx);
        let gasPrice = transaction.gasPrice
        let gasCost = new BigNumber(gasPrice * gasUsed)
        let actualAfterBalanceSeller = balanceSellerBefore.minus(gasCost).plus(price)

        // Should not be necessary? Normally web3 returns bigNumber
        let balanceContractAfter = new BigNumber(await web3.eth.getBalance(instance.address))

        //Then
        assert.strictEqual(actualAfterBalanceSeller.toString(), expectedBalanceSellerAfter.toString(), "Seller should have more money after deal (+ price)")
        assert.strictEqual(balanceContractBefore.toString(), price.toString(), "Balance before withdraw should be equal to price")
        assert.strictEqual(balanceContractAfter.toString(), '0', "Balance after should be 0")
        assert.strictEqual(await instance.contractIsClosed(), true, "Contract should be closed")
    })

/***********************************************************************************
 Event tests
/**********************************************************************************/
    
    it("Paid event is emitted", async () => {
        // Given
        await instance.setItem(book, price)
        
        // When
        let result = await instance.payItem({value: price, from: buyer})

        // Assert
        truffleAssert.eventEmitted(result, 'PaidItem', (ev) => {
            return ev.buyer === buyer && 
            ev.seller === seller &&
            ev.price.toString() === price.toString();
          }, 'Contract should emit right event');
    })

    it("Withdraw Event is emitted", async () => {
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        await instance.itemReceived({from: buyer})
        
        // When
        let result = await instance.withdraw({from: seller})

        // Assert
        truffleAssert.eventEmitted(result, 'ContractIsSettled', (ev) => {
            return ev.buyer === buyer && 
            ev.seller === seller &&
            ev.price.toString() === price.toString();
          }, 'Contract should emit right event');
    })

    it("WithdrawalFromRetraction is emitted by buyer", async () => {
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        await instance.retractContract({from: buyer})
        await instance.finalizeRetraction(true, {from: intermediator})
        
        // When
        let result = await instance.withdraw({from: buyer})

        // Assert
        truffleAssert.eventEmitted(result, 'WithdrawalFromRetraction', (ev) => {
            return ev.retractor === buyer && 
            ev.price.toString() === price.toString();
          }, 'Contract should emit right event');
    })

    it("WithdrawalFromRetraction is emitted by seller", async () => {
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        await instance.retractContract({from: seller})
        await instance.finalizeRetraction(false, {from: intermediator})
        
        // When
        let result = await instance.withdraw({from: seller})

        // Assert
        truffleAssert.eventEmitted(result, 'WithdrawalFromRetraction', (ev) => {
            return ev.retractor === seller && 
            ev.price.toString() === price.toString();
          }, 'Contract should emit right event');
    })
})

