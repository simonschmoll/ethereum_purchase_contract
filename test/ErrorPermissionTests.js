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

    it("Item is tried to set by other than seller", async () => {
        try {
            // When
            await instance.setItem(book, price, {from: buyer})
            assert.fail
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })

    it("Item paid by other than buyer", async () => {
        // Given
        await instance.setItem(book, price)
        
        try {
            // When
            await instance.payItem({value: price, from: seller})
            assert.fail            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })

    it("Item received by other than buyer", async () => {
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        try {
            // When
            await instance.itemReceived({from: seller})
            assert.fail            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })

    it("Money withdraw by other than seller", async () => {
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        await instance.itemReceived({from: buyer})
        try {
            // When
            await instance.withdraw({from: buyer});
            assert.fail            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })

    it("Retracted contract without permission", async () => {
        try {
            // When
            await instance.retractContract({from: randomGuy});
            assert.fail            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })
    
    it("Withdraw money after retraction without permission", async () => {
        // Given 
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer}) 
        await instance.retractContract({from: seller})
        await instance.retractContract({from: buyer})  
        try {
            // When
            await instance.withdrawAfterRetraction({from: buyer})
            assert.fail            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    }) 
})