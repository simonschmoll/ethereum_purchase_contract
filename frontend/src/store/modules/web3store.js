import getWeb3 from '../../util/getWeb3@1.0';
// import abiJson from '../../util/abi.json';
import { abi } from '../../../../build/contracts/SalesContract.json';

export default {
  state: {
    web3: {
      isInjected: false,
      web3Instance: null,
      networkId: null,
      currentAccount: null,
      error: null,
    },
    contractInstance: null,
    contractState: {
      balance: null,
      seller: null,
      buyer: null,
      intermediator: null,
      item: {
        name: '',
        price: 0,
        itemPaid: false,
        itemReceived: false,
      },
    },
    web3Instance: null,
  },
  actions: {
    registerWeb3({ commit }) {
      commit('registerWeb3Instance', getWeb3);
      console.log('registerWeb3 called in store');
    },
    setItem({ commit }, payload) {
      commit('setItem', payload);
    },
    receivedItem({ commit }) {
      commit('receivedItem');
    },
  },
  getters: {
    getItemName: state => state.contractState.item.name,
    getItemPrice: state => state.contractState.item.price,
  },
  mutations: {
    receivedItem() {
      // if(eth.coinbase)
      // state.contractInstance.methods.setItem(name.toString(), price)
    },
    setItem(state, { name, price }) {
      console.log('Name und Price', name, price);
      console.log('Setting the name and price in mutations, contractInstance:', state.contractInstance);
      state.contractInstance.methods.setItem(name.toString(), price)
        .send({ from: state.web3.currentAccount })
        .on('error', console.error)
        .then((receipt) => {
          state.contractState.item = [...state.contractState.item];
          state.contractState.item.name = name;
          state.contractState.item.price = price;
          console.log(receipt, state.contractState.item.name, state.contractState.item.price);
        });
    },
    registerWeb3Instance(state, payload) {
      console.log('registerWeb3instance Mutation being executed', payload);
      console.log('Setting web3 in mutation');
      const web3InstanceLocal = payload;
      state.web3Instance = payload;

      // Load contract data
      function loadContractData(localContractInstance) {
        localContractInstance.methods.getContractBalance().call({ from: state.web3.currentAccount })
          .then((result) => { state.contractState.balance = result; });
        localContractInstance.methods.getItem().call({ from: state.web3.currentAccount })
          .then((result) => { state.contractState.item = result; });
        localContractInstance.methods.getSeller().call({ from: state.web3.currentAccount })
          .then((result) => { state.contractState.seller = result; });
        localContractInstance.methods.getBuyer().call({ from: state.web3.currentAccount })
          .then((result) => { state.contractState.buyer = result; });
        localContractInstance.methods.getIntermediator().call({ from: state.web3.currentAccount })
          .then((result) => { state.contractState.intermediator = result; });
        console.log('Contract Instance is:', state.contractState);
      }

      function watchEvents(contractInstance) {
        contractInstance.getPastEvents('SetItem', {
          fromBlock: 0,
          toBlock: 'latest',
        })
          .then((events) => {
            console.log(events);
          });
      }

      function deployContract() {
        state.contractInstance = new web3InstanceLocal.eth.Contract(abi, '0xdb6001a0DA78f1b54F5D551909c9Cb6F4c376BDa');
        // state.contractInstance.deploy({
        //   data: FILLDATA,
        //   arguments: [FillData],
        // }).send({ from: state.web3.coinbase })
        //   .then((newContractInstance) => {
        //     loadContractData(newContractInstance);
        //   });
        return state.contractInstance;
      }
      web3InstanceLocal.eth.getAccounts().then((accounts) => {
        const [account] = accounts;
        console.log('current account', account);
        state.web3.currentAccount = account;
        const contractInstance = deployContract();
        loadContractData(contractInstance);
        watchEvents(contractInstance);
      });
    },
  },
};
