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

    it("Buyer wants to mark item as received, but it is not yet paid", async () => {    
        // Given
        await instance.setItem(book, price)
        
        try {
            await instance.itemReceived({from: buyer})
            assert.fail()            
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
            assert.fail()            
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
            assert.fail()            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })

    it("Contract is not retracted and buyer wants to withdraw money", async () => {    
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        try {
            await instance.withdrawAfterRetraction({from: buyer})
            assert.fail()            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    }) 
})