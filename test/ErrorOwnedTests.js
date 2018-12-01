const SalesContract = artifacts.require("SalesContract");

contract('Error Tests for owned functionality', async (accounts) => {
    let instance
    const [seller, buyer, intermediator, randomGuy] = accounts
    const defaultAddress = '0x0000000000000000000000000000000000000000'

    beforeEach('Setup of contract', async function () {
        // Given
        instance = await SalesContract.new(buyer, intermediator)
    })

    it("Wrong permission for disowning seller", async () => {    
        try {
            // When
            await instance.disown({from: buyer})
            assert.fail            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })
    
    it("Wrong permission for changing seller", async () => {
        try {
            // When
            await instance.changeSeller(randomGuy, {from: buyer})
            assert.fail            
        } catch (error) {
            // Then
            assert.ok(/revert/.test(error))
        }
    })
})