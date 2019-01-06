import getWeb3 from '../../util/getWeb3@1.0';
import abi from '../../util/abi.json';

export default {
  state: {
    web3: {
      isInjected: false,
      web3Instance: null,
      networkId: null,
      coinbase: null,
      error: null,
    },
    contractInstance: null,
    contractState: {
      balance: null,
      seller: null,
      buyer: null,
      intermediator: null,
      item: null,
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
  },
  mutations: {
    setItem(state, { name, price }) {
      console.log('Name und Price', name, price);
      const localContractInstance = state.contractInstance;
      localContractInstance.methods.setItem(name.toString(), price)
        .send({ from: state.web3.coinbase });
    },
    registerWeb3Instance(state, payload) {
      console.log('registerWeb3instance Mutation being executed', payload);
      console.log('Setting web3 in mutation');
      const web3InstanceLocal = payload;
      state.web3Instance = payload;
      state.contractInstance = new web3InstanceLocal.eth.Contract(
        abi, process.env.VUE_APP_CONTRACT_ADDRESS.toString(),
      );
      const localContractInstance = state.contractInstance;
      // Load contract data
      function loadContractData() {
        localContractInstance.methods.getContractBalance().call({ from: state.web3.coinbase })
          .then((result) => { state.contractState.balance = result; });
        localContractInstance.methods.getItem().call({ from: state.web3.coinbase })
          .then((result) => { state.contractState.item = result; });
        localContractInstance.methods.getSeller().call({ from: state.web3.coinbase })
          .then((result) => { state.contractState.seller = result; });
        localContractInstance.methods.getBuyer().call({ from: state.web3.coinbase })
          .then((result) => { state.contractState.buyer = result; });
        localContractInstance.methods.getIntermediator().call({ from: state.web3.coinbase })
          .then((result) => { state.contractState.intermediator = result; });
        console.log('Contract Instance is:', state.contractState);
      }
      web3InstanceLocal.eth.getCoinbase().then((result) => {
        state.web3.coinbase = result;
        loadContractData();
      });
    },
  },
};
