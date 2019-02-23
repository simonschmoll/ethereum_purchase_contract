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
        assert.strictEqual(agreement.sellerRetract, false, "Agreement fields (seller) should be set to false")
        assert.strictEqual(agreement.buyerRetract, false, "Agreement fields (buyer) should be set to false")
        assert.strictEqual(agreement.intermediatorRetract, false, "Agreement fields (intermediator) should be set to false")
    })

    /***********************************************************************************
     retractContract() test single fields
    /**********************************************************************************/

    it("Retract contract seller", async () => {

        // When 
        await instance.retractContract({from: seller})
        let agreement = await instance.agreement()

        // Then
        assert.strictEqual(agreement.sellerRetract, true, "sellerRetracted should be marked false")
    })

    it("Retract contract buyer", async () => {

        // When 
        await instance.retractContract({from: buyer})
        let agreement = await instance.agreement()

        // Then
        assert.strictEqual(agreement.buyerRetract, true, "buyerRetract should be marked false")
    })  

    it("Retract contract intermediator", async () => {

        // When 
        await instance.retractContract({from: intermediator})
        let agreement = await instance.agreement()

        // Then
        assert.strictEqual(agreement.intermediatorRetract, true, "intermediatorRetract should be marked false")
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
        assert.strictEqual(await instance.contractRetracted(), true, "Contract should be retracted")
        assert.strictEqual(agreement.sellerRetract, false, "sellerRetracted should be marked false")
        assert.strictEqual(agreement.buyerRetract, true, "buyerRetract should be marked true")
        assert.strictEqual(agreement.intermediatorRetract, true, "intermediatorRetract should be marked true")
        assert.strictEqual(await instance.contractIsClosed(), false, "Contract should not be marked closed, as there is still money in the contract")

    })

    it("Retract unpaid contract buyer and intermediator", async () => {
        // Given 
        await instance.setItem(book, price)

        // When 
        await instance.retractContract({from: buyer})
        await instance.retractContract({from: intermediator})
        let agreement = await instance.agreement()

        // Then
        assert.strictEqual(await instance.contractRetracted(), true, "Contract should be retracted")
        assert.strictEqual(agreement.sellerRetract, false, "sellerRetracted should be marked false")
        assert.strictEqual(agreement.buyerRetract, true, "buyerRetract should be marked true")
        assert.strictEqual(agreement.intermediatorRetract, true, "intermediatorRetract should be marked true")
        assert.strictEqual(await instance.contractIsClosed(), true, "Contract should be marked closed, as there is no money in the contract")
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
        assert.strictEqual(await instance.contractRetracted(), true, "Contract should be retracted")
        assert.strictEqual(agreement.buyerRetract, false, "buyerRetracted should be marked false")
        assert.strictEqual(agreement.sellerRetract, true, "sellerRetracted should be marked true")
        assert.strictEqual(agreement.intermediatorRetract, true, "intermediatorRetracted should be marked true")
        assert.strictEqual(await instance.contractIsClosed(), false, "Contract should not be marked closed, as there is still money in the contract")
    })

    it("Retract unpaid contract seller and intermediator", async () => {
        // Given 
        await instance.setItem(book, price)

        // When 
        await instance.retractContract({from: seller})
        await instance.retractContract({from: intermediator})
        let agreement = await instance.agreement()

        // Then
        assert.strictEqual(await instance.contractRetracted(), true, "Contract should be retracted")
        assert.strictEqual(agreement.buyerRetract, false, "buyerRetracted should be marked false")
        assert.strictEqual(agreement.sellerRetract, true, "sellerRetracted should be marked true")
        assert.strictEqual(agreement.intermediatorRetract, true, "intermediatorRetracted should be marked true")
        assert.strictEqual(await instance.contractIsClosed(), true, "Contract should be marked closed, as there is no money in the contract")
    })
})