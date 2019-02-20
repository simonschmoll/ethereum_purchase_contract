const BigNumber = require('bignumber.js')

const SalesContract = artifacts.require("SalesContract");

contract('Successful Tests for ContractRetraction', async (accounts) => {
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
 agreement struct correctly initialized test
/**********************************************************************************/

it("Agreement struct is correctly initialized", async () => {
    // Given
    let agreement = await instance.agreement()

    //Assert
    assert.strictEqual(agreement.sellerRetract, false)
    assert.strictEqual(agreement.buyerRetract, false)
    assert.strictEqual(agreement.intermediatorRetract, false)
})

/***********************************************************************************
 retractContract() test (buyer and intermediator)
/**********************************************************************************/
   

    it("Retract paid contract buyer and intermediator", async () => {
        // Given 
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})

        // When 
        await instance.retractContract({from: buyer})
        await instance.retractContract({from: intermediator})
        let agreement = await instance.agreement()

        // Then
        assert.strictEqual(await instance.contractRetracted(), true)
        assert.strictEqual(agreement.sellerRetract, false)
        assert.strictEqual(agreement.buyerRetract, true)
        assert.strictEqual(agreement.intermediatorRetract, true)
        assert.strictEqual(await instance.contractIsClosed(), false)

    })

    it("Retract unpaid contract buyer and intermediator", async () => {
        // Given 
        await instance.setItem(book, price)

        // When 
        await instance.retractContract({from: buyer})
        await instance.retractContract({from: intermediator})
        let agreement = await instance.agreement()

        // Then
        assert.strictEqual(await instance.contractRetracted(), true)
        assert.strictEqual(agreement.sellerRetract, false)
        assert.strictEqual(agreement.buyerRetract, true)
        assert.strictEqual(agreement.intermediatorRetract, true)
        assert.strictEqual(await instance.contractIsClosed(), true)
    })

/***********************************************************************************
 retractContract() test (seller and intermediator)
/**********************************************************************************/
  
    it("Retract paid contract seller and intermediator", async () => {
        // Given 
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})

        // When 
        await instance.retractContract({from: seller})
        await instance.retractContract({from: intermediator})
        let agreement = await instance.agreement()

        // Then
        assert.strictEqual(await instance.contractRetracted(), true)
        assert.strictEqual(agreement.buyerRetract, false)
        assert.strictEqual(agreement.sellerRetract, true)
        assert.strictEqual(agreement.intermediatorRetract, true)
        assert.strictEqual(await instance.contractIsClosed(), false)
    })

    it("Retract unpaid contract seller and intermediator", async () => {
        // Given 
        await instance.setItem(book, price)

        // When 
        await instance.retractContract({from: seller})
        await instance.retractContract({from: intermediator})
        let agreement = await instance.agreement()

        // Then
        assert.strictEqual(await instance.contractRetracted(), true)
        assert.strictEqual(agreement.buyerRetract, false)
        assert.strictEqual(agreement.sellerRetract, true)
        assert.strictEqual(agreement.intermediatorRetract, true)
        assert.strictEqual(await instance.contractIsClosed(), true)
    })
})