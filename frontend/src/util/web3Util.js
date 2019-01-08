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
  console.log('Seller, Buyer, interm in web3util deploy:', seller, buyer, intermediator);
  return contract.deploy({
    data: bytecode.toString(),
    arguments: ['0xbf8f723E3ceFB60760F4De122E1c38212BC9E6DE', '0xD8032D9C8691150d8bBB83B2AB8348feab23c0C3'],
  }).send({ from: '0xa971e6cB801EC457840D6837B4796BCB0a0C55e3' });
}

async function loadExistingContract(address) {
  const contract = new getWeb3.eth.Contract(
    abi, address,
  );
  return contract;
}

async function loadContractData(contract, contractState) {
  await contract.methods.getContractBalance().call()
    .then((result) => { contractState.balance = result; });
  await contract.methods.getItem().call()
    .then((result) => { contractState.item = result; });
  await contract.methods.getSeller().call()
    .then((result) => { contractState.seller = result; });
  await contract.methods.getBuyer().call()
    .then((result) => { contractState.buyer = result; });
  await contract.methods.getIntermediator().call()
    .then((result) => { contractState.intermediator = result; });
  console.log('web3util: Contract Instance is:', contractState);
  return contractState;
}

async function setItem(contractInstance, name, price) {
  return contractInstance.methods.setItem(name.toString(), price.toString())
    .send({ from: window.web3.eth.defaultAccount });
}

async function itemReceived(contractInstance) {
  console.log('Default account in item received', window.web3.eth.defaultAccount);
  return contractInstance.methods.itemReceived()
    .send({ from: window.web3.eth.defaultAccount });
}

async function payItem(contractInstance, price) {
  console.log('Paying called in webutil', price);
  return contractInstance.methods.payItem()
    .send({ from: window.web3.eth.defaultAccount, value: price });
}

async function withdraw(contractInstance) {
  console.log('Withdraw called in webutil');
  return contractInstance.methods.withdraw()
    .send({ from: window.web3.eth.defaultAccount });
}

// function watchEvents(contractInstance) {
//   contractInstance.getPastEvents('SetItem', {
//     fromBlock: 0,
//     toBlock: 'latest',
//   })
//     .then((events) => {
//       console.log(events);
//     });
// }

export default {
  getAccount,
  deployContract,
  loadContractData,
  loadContract,
  setItem,
  itemReceived,
  loadExistingContract,
  payItem,
  withdraw,
};
