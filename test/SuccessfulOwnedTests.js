const SalesContract = artifacts.require("SalesContract");

contract('Successful Tests for owned functionality', async (accounts) => {
    let instance
    const [seller, buyer, intermediator, randomGuy] = accounts
    const defaultAddress = '0x0000000000000000000000000000000000000000'

    beforeEach('Setup of contract', async function () {
        // Given
        instance = await SalesContract.new(buyer, intermediator)
    })

/***********************************************************************************
 disown() tests
/**********************************************************************************/
 
    it("Disown seller", async () => {
        // When
        await instance.disown()

        // Then
        assert.strictEqual(await instance.seller(), defaultAddress)
    })

/***********************************************************************************
 changeSeller() tests
/**********************************************************************************/
   
    it("Change seller", async () => {
        // When
        await instance.changeSeller(accounts[4], {from: seller})

        // Then
        assert.strictEqual(await instance.seller(), accounts[4])
    })
})