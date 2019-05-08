import getWeb3 from './getWeb3';
import { abi, bytecode } from '../../../build/contracts/SalesContract.json';

async function getAccount() {
  return getWeb3.eth.getAccounts();
}

async function loadContract(contractAddress) {
  const contract = new getWeb3.eth.Contract(
    abi, contractAddress,
  );
  return contract;
}
async function deployContract(seller, buyer, intermediator) {
  const contract = new getWeb3.eth.Contract(
    abi,
  );
  return contract.deploy({
    data: bytecode.toString(),
    arguments: [buyer, intermediator],
  }).send({ from: seller });
}

async function loadExistingContract(address) {
  const contract = new getWeb3.eth.Contract(
    abi, address,
  );
  return contract;
}

async function changeSeller(contractInstance, newSellerAddress) {
  return contractInstance.methods.changeSeller(newSellerAddress)
    .send({ from: window.web3.eth.defaultAccount });
}

async function loadContractData(contract, contractState) {
  return new Promise(async (resolve, reject) => {
    await contract.methods.getContractBalance().call()
      .then((result) => { contractState.balance = getWeb3.utils.fromWei(result); });
    await contract.methods.getItem().call()
      .then((result) => {
        contractState.item = result;
        contractState.item.price = getWeb3.utils.fromWei(result.price);
      });
    await contract.methods.getSeller().call()
      .then((result) => { contractState.seller = result; });
    await contract.methods.getBuyer().call()
      .then((result) => { contractState.buyer = result; });
    await contract.methods.getIntermediator().call()
      .then((result) => { contractState.intermediator = result; });
    await contract.methods.getIsContractClosed().call()
      .then((result) => { contractState.contractClosed = result; });
    await contract.methods.getAgreement().call()
      .then((result) => { contractState.agreement = result; });
    await contract.methods.getBuyerIsPaidBack().call()
      .then((result) => { contractState.buyerIsPaidBack = result; });
    await contract.methods.getContractRetracted().call()
      .then((result) => { contractState.retracted = result; });
    await contract.methods.getItemIsSet().call()
      .then((result) => { contractState.itemIsSet = result; });
    resolve(contractState);
    reject(new Error('Could not load contract data'));
  });
}

async function setItem(contractInstance, name, price) {
  return contractInstance.methods.setItem(name.toString(), getWeb3.utils.toWei(price.toString()))
    .send({ from: window.web3.eth.defaultAccount });
}

async function itemReceived(contractInstance) {
  return contractInstance.methods.itemReceived()
    .send({ from: window.web3.eth.defaultAccount });
}

async function payItem(contractInstance, price) {
  const priceInWei = getWeb3.utils.toWei(price);
  return contractInstance.methods.payItem()
    .send({ from: window.web3.eth.defaultAccount, value: priceInWei });
}

async function withdraw(contractInstance) {
  return contractInstance.methods.withdraw()
    .send({ from: window.web3.eth.defaultAccount });
}

async function retractContract(contractInstance) {
  return contractInstance.methods.retractContract()
    .send({ from: window.web3.eth.defaultAccount });
}

async function finalizeRetraction(contractInstance, buyerRuledRight) {
  return contractInstance.methods.finalizeRetraction(buyerRuledRight)
    .send({ from: window.web3.eth.defaultAccount });
}

async function getAgreement(contract) {
  return contract.methods.getAgreement().call();
}

async function getBalance(contract) {
  return contract.methods.getContractBalance().call();
}

export default {
  changeSeller,
  getAccount,
  deployContract,
  loadContractData,
  loadContract,
  setItem,
  itemReceived,
  loadExistingContract,
  payItem,
  withdraw,
  getAgreement,
  retractContract,
  finalizeRetraction,
  getBalance,
};
