const BigNumber = require('bignumber.js')

const SalesContract = artifacts.require("SalesContract");

contract('Error test for contract retraction', async (accounts) => {
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
 retractContract test without permission
/**********************************************************************************/
   
    it("Retracted contract without permission", async () => {
        try {
            // When
            await instance.retractContract({from: randomGuy});
            assert.fail()            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })

/***********************************************************************************
 retractContract test while contract not intact
/**********************************************************************************/
   
    it("Contract is not intact anymore, but user wants to retract", async () => {    
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        await instance.itemReceived({from: buyer})
        await instance.withdraw({from: seller})
        try {
            // When
            await instance.retractContract()
            assert.fail()            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })

/***********************************************************************************
 retractContract test, attempt by third participant to also retract
/**********************************************************************************/
    
    it("Contract is retracted, but seller wants to retract also", async () => {    
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        await instance.retractContract({from: buyer})
        await instance.retractContract({from: intermediator})
        try {
            // When
            await instance.retractContract({from: seller})
            assert.fail()            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })

    it("Contract is retracted, but buyer wants to retract also", async () => {    
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        await instance.retractContract({from: seller})
        await instance.retractContract({from: intermediator})
        try {
            // When
            await instance.retractContract({from: buyer})
            assert.fail()            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })

/***********************************************************************************
 retractContract test seller and buyer try both to retract while contract is intact
/**********************************************************************************/
    it("Buyer wants to retract after Seller has already retracted", async () => {    
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        await instance.retractContract({from: seller})
        try {
            // When
            await instance.retractContract({from: buyer})
            assert.fail()            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })

    it("Seller wants to retract after Buyer has already retracted", async () => {    
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        await instance.retractContract({from: buyer})
        try {
            // When
            await instance.retractContract({from: seller})
            assert.fail("Test should fail")            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })
})