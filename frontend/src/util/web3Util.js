import getWeb3 from './getWeb3';
import { abi } from '../../../build/contracts/SalesContract.json';

function getAccount() {
  getWeb3.eth.getAccounts().then((accounts) => {
    const [account] = accounts;
    console.log('current account', account);
    return account;
  });
}

function deployContract() {
  const contract = new getWeb3.eth.Contract(
    abi, '0xdb6001a0DA78f1b54F5D551909c9Cb6F4c376BDa',
  );
  // state.contractInstance.deploy({
  //   data: FILLDATA,
  //   arguments: [FillData],
  // }).send({ from: getWeb3.coinbase })
  //   .then((newContractInstance) => {
  //     loadContractData(newContractInstance);
  //   });
  return contract;
}

async function loadContractData(contract, contractState) {
  await contract.methods.getContractBalance().call({ from: getWeb3.currentAccount })
    .then((result) => { contractState.balance = result; });
  await contract.methods.getItem().call({ from: getWeb3.currentAccount })
    .then((result) => { contractState.item = result; });
  await contract.methods.getSeller().call({ from: getWeb3.currentAccount })
    .then((result) => { contractState.seller = result; });
  await contract.methods.getBuyer().call({ from: getWeb3.currentAccount })
    .then((result) => { contractState.buyer = result; });
  await contract.methods.getIntermediator().call({ from: getWeb3.currentAccount })
    .then((result) => { contractState.intermediator = result; });
  console.log('Contract Instance is:', contractState);
  return contractState;
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

export default { getAccount, deployContract, loadContractData };
