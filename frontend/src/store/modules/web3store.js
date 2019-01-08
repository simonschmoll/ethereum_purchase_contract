import web3util from '../../util/web3Util';

export default {
  state: {
    web3: {
      isInjected: false,
      web3Instance: null,
      networkId: null,
      currentAccount: null,
      accounts: null,
      error: null,
    },
    contractInstance: null,
    contractState: {
      balance: null,
      seller: null,
      buyer: null,
      intermediator: null,
      contractClosed: false,
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
    async loadInitialData({ state, commit }) {
      console.log('Loading InitialData');
      // if (!state.web3.accounts) {
      //   web3util.getAccount().then((accounts) => {
      //     console.log('Account in action loadinitialData', accounts);
      //     commit('setCurrentAccount', accounts);
      //   });
      // }
      let contractInstanceLocal = state.contractInstance;

      // TODO: just for testing, connect to existing contract
      contractInstanceLocal = await web3util.loadExistingContract('0x9a8C75f92251F6c4159ea25C571efB4665D2b854');
      console.log('contract Instance in loadInitData action', contractInstanceLocal);
      state.contractInstance = contractInstanceLocal;

      if (contractInstanceLocal) {
        commit('loadInitialData', await web3util.loadContractData(
          contractInstanceLocal, state.contractState,
        ));
      }
    },
    async setItem({ state, commit }, { name, price }) {
      console.log('Set Item account', window.web3.eth.defaultAccount);
      web3util.setItem(state.contractInstance, name, price)
        .then(() => {
          commit('setItem', { name, price });
        });
    },
    receivedItem({ state, commit }) {
      web3util.itemReceived(state.contractInstance)
        .then(() => commit('receivedItem'));
    },
    async deploy({ commit, dispatch }, { seller, buyer, intermediator }) {
      console.log('mutation deploy called in store', seller, buyer, intermediator);
      web3util.deployContract(seller, buyer, intermediator)
        .then((instance) => {
          commit('saveContract', instance);
          dispatch('loadInitialData');
        });
    },
    async pay({ commit, state }, price) {
      web3util.payItem(state.contractInstance, price)
        .then(() => commit('pay'));
    },
    async withdraw({ commit, state }) {
      web3util.withdraw(state.contractInstance)
        .then(() => commit('withdraw'));
    },
  },
  getters: {
    getItem: state => state.contractState.item,
    getStatus: state => state.contractState.contractClosed,
  },
  mutations: {
    saveContract(state, payload) {
      console.log('deploy mutation contract instance =', payload);
      state.contractInstance = payload;
    },
    receivedItem(state) {
      console.log('Received action called');
      state.contractState.item = Object.assign(
        {}, state.contractState.item, { itemReceived: true },
      );
    },
    setItem(state, { name, price }) {
      state.contractState.item = Object.assign({}, state.contractState.item, { name, price });
      console.log('New item state after setting item in mutation', state.contractState.item);
    },
    loadInitialData(state, payload) {
      state.contractState = payload;
      state.web3.currentAccount = window.web3.eth.defaultAccount;
      console.log('Intial Contract State: ', payload);
    },
    pay(state) {
      state.contractState.item = Object.assign({}, state.contractState.item, { itemPaid: true });
      console.log('Changing state of item after payment in mutations');
    },
    withdraw(state) {
      console.log('Contract is now closed');
      state.contractState.contractClosed = true;
      console.log('ContractStatus', state.contractClosed);
    },
  },
};
