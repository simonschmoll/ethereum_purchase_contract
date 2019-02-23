const SalesContract = artifacts.require("SalesContract");

contract('Error Tests for owned functionality', async (accounts) => {
    let instance
    const [seller, buyer, intermediator, randomGuy] = accounts
    const book = "book"
    var price

    beforeEach('Setup of contract', async function () {
        // Given
        instance = await SalesContract.new(buyer, intermediator)
        price = web3.utils.toBN((web3.utils.toWei('1', 'ether')))
    })

/***********************************************************************************
 disown() tests
/**********************************************************************************/
 
    it("Wrong permission for disowning seller", async () => {    
        try {
            // When
            await instance.disown({from: buyer})
            assert.fail("disown from buyer should fail")            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })

    it("Contract is retracted, seller tries to disown", async () => {    
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        await instance.retractContract({from: buyer})
        await instance.retractContract({from: intermediator})

        try {
            // When
            await instance.disown({from: seller})
            assert.fail("disown from seller should fail")            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })

/***********************************************************************************
 changeSeller() tests
/**********************************************************************************/
    
    it("Wrong permission for changing seller", async () => {
        try {
            // When
            await instance.changeSeller(randomGuy, {from: buyer})
            assert.fail("changeSeller from buyer should fail")           
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })

    it("Contract is retracted, seller tries to change seller", async () => {    
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        await instance.retractContract({from: buyer})
        await instance.retractContract({from: intermediator})

        try {
            // When
            await instance.changeSeller(randomGuy, {from: seller})
            assert.fail("changeSeller from seller should fail")            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })
})