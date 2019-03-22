const BigNumber = require('bignumber.js')

const SalesContract = artifacts.require("SalesContract");

contract('Error test for sales contract', async (accounts) => {
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
 setItem tests
/**********************************************************************************/
    
    it("Item is tried to set by other than seller", async () => {
        try {
            // When
            await instance.setItem(book, price, {from: buyer})
            assert.fail("setItem should fail")
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })
    
    it("Seller tries to set item twice", async () => {
        await instance.setItem(book, price)
        assert.strictEqual(await instance.itemIsSet(), true)
        try {
            // When
            await instance.setItem(book, price)
            assert.fail("setItem should fail")
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })

/***********************************************************************************
 payItem tests
/**********************************************************************************/

    it("Item paid by other than buyer", async () => {
        // Given
        await instance.setItem(book, price)
        
        try {
            // When
            await instance.payItem({value: price, from: seller})
            assert.fail("payItem should fail")            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })

    it("Buyer wants to pay item, but contract is not intact", async () => {
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        await instance.itemReceived({from: buyer})
        await instance.withdraw({from: seller})
        
        try {
            // When
            await instance.payItem({value: price, from: buyer})
            assert.fail("payItem should fail")
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })

    it("Payment is smaller than price", async () => {
        // Given
        await instance.setItem(book, price)
        let wrongPrice = web3.utils.toBN((web3.utils.toWei('0.5', 'ether')))
        try {
            // When
            await instance.payItem({value: wrongPrice, from: buyer})
            assert.fail("payItem should fail")            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })

/***********************************************************************************
 itemReceived tests
/**********************************************************************************/

    it("Item received by other than buyer", async () => {
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        try {
            // When
            await instance.itemReceived({from: seller})
            assert.fail("itemReceived should fail")            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })

    it("Buyer wants to mark item as received, but it is not yet paid", async () => {    
        // Given
        await instance.setItem(book, price)
        
        try {
            await instance.itemReceived({from: buyer})
            assert.fail("itemReceived should fail")            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })

/***********************************************************************************
 withdraw tests
/**********************************************************************************/

    it("Money withdraw by other than seller (normal flow)", async () => {
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        await instance.itemReceived({from: buyer})
        try {
            // When
            await instance.withdraw({from: buyer});
            assert.fail("withdraw should fail")           
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })
    
    it("Item is not marked as received, but seller wants to withdraw money", async () => {    
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        try {
            await instance.withdraw({from: seller})
            assert.fail("withdraw should fail")            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })

    it("Contract is not intact anymore, but seller wants to withdraw money", async () => {    
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        await instance.itemReceived({from: buyer})
        await instance.withdraw({from: seller})
        try {
            await instance.withdraw({from: seller})
            assert.fail("withdraw should fail")            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })

    it("Buyer is ruled to be correct in dispute, but seller wants to withdraw money", async () => {    
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        await instance.retractContract({from: buyer})
        await instance.finalizeRetraction(true, {from: intermediator})
        try {
            await instance.withdraw({from: seller})
            assert.fail("withdraw should fail")            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })

    it("Seller is ruled to be correct in dispute, but buyer wants to withdraw money", async () => {    
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        await instance.retractContract({from: seller})
        await instance.finalizeRetraction(false, {from: intermediator})
        try {
            await instance.withdraw({from: buyer})
            assert.fail("withdraw should fail")            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })
})