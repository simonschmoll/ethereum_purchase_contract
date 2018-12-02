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

    it("Only one member retracts contact", async () => {    
        // When
        await instance.retractContract()
        let agreement = await instance.agreement()

        // Then
        assert.strictEqual(agreement.sellerRetract, true)
        assert.strictEqual(await instance.contractRetracted(), false)
        
        // Withdraw needs to fail
        try {
            await instance.withdrawAfterRetraction({from:buyer})
            assert.fail()           
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })

    it("Contract is not intact anymore, but user wants to retract", async () => {    
        // Given
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        await instance.itemReceived({from: buyer})
        await instance.withdraw({from: seller})
        try {
            await instance.retractContract()
            assert.fail()            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })
})