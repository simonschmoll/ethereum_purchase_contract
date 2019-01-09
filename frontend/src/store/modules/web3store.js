import web3util from '../../util/web3Util';

export default {
  state: {
    contractInstance: null,
    contractState: {
      retracted: false,
      agreement: {
        sellerRetract: false,
        buyerRetract: false,
        intermediatorRetract: false,
      },
      balance: null,
      seller: null,
      buyer: null,
      intermediator: null,
      contractClosed: false,
      buyerIsPaidBack: false,
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
      let contractInstanceLocal = state.contractInstance;

      // TODO: just for testing, connect to existing contract
      contractInstanceLocal = await web3util.loadExistingContract('0x2313A1f6A8EF84b3320761aF1f8298B84229D09D');
      console.log('contract Instance in loadInitData action', contractInstanceLocal);
      state.contractInstance = contractInstanceLocal;

      if (contractInstanceLocal) {
        console.log('Loading contract data (action) if condition (init)');
        web3util.loadContractData(
          contractInstanceLocal, state.contractState,
        ).then((result) => { commit('loadInitialData', result); });
        // commit('loadInitialData', await web3util.loadContractData(
        //   contractInstanceLocal, state.contractState,
        // ));
      }
    },
    async loadContractData({ state, commit }) {
      console.log('Loading contract data (action)');
      if (state.contractInstance) {
        console.log('Loading contract data (action) if condition');
        web3util.loadContractData(state.contractInstance, state.contractState)
          .then((result) => { commit('saveContractData', result); });
      }
    },
    async setItem({ state, commit }, { name, price }) {
      console.log('Set Item account', window.web3.eth.defaultAccount);
      web3util.setItem(state.contractInstance, name, price)
        .then(() => {
          commit('setItem', { name, price });
        });
    },
    async receivedItem({ state, commit }) {
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
    async pay({ dispatch, state }, price) {
      web3util.payItem(state.contractInstance, price)
        .then(() => dispatch('loadBalance'));
    },
    async loadBalance({ commit, state }) {
      web3util.getBalance(state.contractInstance)
        .then((balance) => {
          commit('pay');
          commit('updateBalance', balance);
        });
    },
    async withdraw({ commit, state }) {
      web3util.withdraw(state.contractInstance)
        .then(() => commit('withdraw'));
    },
    async retract({ dispatch, state }) {
      web3util.retractContract(state.contractInstance)
        .then(() => dispatch('loadContractData'));
    },
    async withdrawAfterDisputeBuyer({ dispatch, state }) {
      web3util.withdrawAfterDisputeBuyer(state.contractInstance)
        .then(() => dispatch('loadContractData'));
    },
    async withdrawAfterDisputeSeller({ dispatch, state }) {
      web3util.withdrawAfterDisputeSeller(state.contractInstance)
        .then(() => dispatch('loadContractData'));
    },
    // async getAgreement({ commit, state }) {
    //   web3util.getAgreement(state.contractInstance)
    //     .then((result) => { commit('updateAgreement', result); });
    // },
  },
  getters: {
    getItem: state => state.contractState.item,
    getStatus: state => state.contractState.contractClosed,
    getAgreement: state => state.contractState.agreement,
    getBuyerIsPaidBack: state => state.contractState.buyerIsPaidBack,
    getBalance: state => state.contractState.balance,
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
      // state.web3.currentAccount = window.web3.eth.defaultAccount;
      console.log('Intial Contract State: ', payload);
    },
    saveContractData(state, payload) {
      console.log('Saving contract Data (mutation)');
      state.contractState = payload;
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
    updateBalance(state, payload) {
      console.log('Updating Balance:', payload);
      state.contractState.balance = payload;
    },
    // updateAgreement(state, payload) {
    //   console.log(`Contract retracted by ${payload} retracted!`);
    //   state.contractState.agreement = Object.assign({}, payload);
    // },
  },
};
