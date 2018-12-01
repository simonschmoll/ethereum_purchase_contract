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

    it("Retract paid contract buyer and intermediator", async () => {
        // Given 
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        let balanceBefore = new BigNumber(await web3.eth.getBalance(instance.address))

        // When 
        await instance.retractContract({from: buyer})
        await instance.retractContract({from: intermediator})

        // Then
        assert.strictEqual(await instance.contractRetracted(), true)
        assert.strictEqual(await instance.contractSettled(), true)
        
        // Should not be necessary? Normally web3 returns bigNumber
        let balanceAfter = new BigNumber(await web3.eth.getBalance(instance.address))
        assert.strictEqual(balanceBefore.toString(), price.toString())
        assert.strictEqual(balanceAfter.toString(), '0')
    })

    it("Retract unpaid contract buyer and intermediator", async () => {
        // Given 
        await instance.setItem(book, price)
        let balanceBefore = new BigNumber(await web3.eth.getBalance(instance.address))

        // When 
        await instance.retractContract({from: buyer})
        await instance.retractContract({from: intermediator})

        // Then
        assert.strictEqual(await instance.contractRetracted(), true)
        assert.strictEqual(await instance.contractSettled(), true)
        
        // Should not be necessary? Normally web3 returns bigNumber
        let balanceAfter = new BigNumber(await web3.eth.getBalance(instance.address))
        assert.strictEqual(balanceBefore.toString(), '0')
        assert.strictEqual(balanceAfter.toString(), '0')
    })

    it("Retract paid contract seller and intermediator", async () => {
        // Given 
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        let balanceBefore = new BigNumber(await web3.eth.getBalance(instance.address))

        // When 
        await instance.retractContract({from: seller})
        await instance.retractContract({from: intermediator})

        // Then
        assert.strictEqual(await instance.contractRetracted(), true)
        assert.strictEqual(await instance.contractSettled(), true)
        
        // Should not be necessary? Normally web3 returns bigNumber
        let balanceAfter = new BigNumber(await web3.eth.getBalance(instance.address))
        assert.strictEqual(balanceBefore.toString(), price.toString())
        assert.strictEqual(balanceAfter.toString(), '0')
    })

    it("Retract unpaid contract seller and intermediator", async () => {
        // Given 
        await instance.setItem(book, price)
        let balanceBefore = new BigNumber(await web3.eth.getBalance(instance.address))

        // When 
        await instance.retractContract({from: seller})
        await instance.retractContract({from: intermediator})

        // Then
        assert.strictEqual(await instance.contractRetracted(), true)
        assert.strictEqual(await instance.contractSettled(), true)
        
        // Should not be necessary? Normally web3 returns bigNumber
        let balanceAfter = new BigNumber(await web3.eth.getBalance(instance.address))
        assert.strictEqual(balanceBefore.toString(), '0')
        assert.strictEqual(balanceAfter.toString(), '0')
    })

    it("Retract paid contract seller and buyer", async () => {
        // Given 
        await instance.setItem(book, price)
        await instance.payItem({value: price, from: buyer})
        let balanceBefore = new BigNumber(await web3.eth.getBalance(instance.address))

        // When 
        await instance.retractContract({from: seller})
        await instance.retractContract({from: buyer})
        // Then
        assert.strictEqual(await instance.contractRetracted(), true)
        assert.strictEqual(await instance.contractSettled(), true)
        
        // Should not be necessary? Normally web3 returns bigNumber
        let balanceAfter = new BigNumber(await web3.eth.getBalance(instance.address))
        assert.strictEqual(balanceBefore.toString(), price.toString())
        assert.strictEqual(balanceAfter.toString(), '0')
    })

    it("Retract paid contract seller and buyer", async () => {
        // Given 
        await instance.setItem(book, price)
        let balanceBefore = new BigNumber(await web3.eth.getBalance(instance.address))

        // When 
        await instance.retractContract({from: seller})
        await instance.retractContract({from: buyer})
        // Then
        assert.strictEqual(await instance.contractRetracted(), true)
        assert.strictEqual(await instance.contractSettled(), true)
        
        // Should not be necessary? Normally web3 returns bigNumber
        let balanceAfter = new BigNumber(await web3.eth.getBalance(instance.address))
        assert.strictEqual(balanceBefore.toString(),'0')
        assert.strictEqual(balanceAfter.toString(), '0')
    })
})