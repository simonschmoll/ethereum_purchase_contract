import web3util from '../../util/web3Util';

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
    loadInitialData({ commit }) {
      commit('loadInitialData');
      console.log('loadInitialData called in store');
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
    async loadInitialData(state) {
      console.log('Loading InitialData');
      console.log('State Before:', state);
      state.web3.currentAccount = await web3util.getAccount();
      console.log('Returning state:', state);
      const contractInstanceLocal = web3util.deployContract();
      state.contractInstance = contractInstanceLocal;
      state.contractState = await web3util.loadContractData(
        contractInstanceLocal, state.contractState,
      );
      // watchEvents(contractInstanceLocal);
    },
  },
};
