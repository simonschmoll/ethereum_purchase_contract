import web3util from '../../util/web3Util';

/* eslint-disable */
export default {
  state: {
    errorFlag: false,
    errorMessage: null,
    loadingFlag: false,
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
      itemIsSet: false,
      item: {
        name: '',
        price: 0,
        itemPaid: false,
        itemReceived: false,
      },
    },
    web3Instance: null,
    web3Address: null,
    
  },
  actions: {
    async connectToContract({ state, dispatch }, { contractAddr }) {
      const contractInstanceLocal = await
      web3util.loadExistingContract(contractAddr.toString());
      console.log('contract Instance in connectToContract action', contractInstanceLocal);
      state.contractInstance = contractInstanceLocal;
      dispatch('loadContractData');
    },

    async pollContract({ state, commit }) {
      state.web3Address = window.web3.eth.defaultAccount;
      if (state.contractInstance) {
        web3util.loadContractData(state.contractInstance, state.contractState)
          .then((result) => { commit('saveContractData', result); });
      }
    },
    async loadInitialData({ state, dispatch }) {
      console.log('Loading InitialData');

      if (state.contractInstance) {
        dispatch('loadContractData')
      }
    },
    async loadContractData({ state, commit }) {
      console.log('Loading contract data (action)');
      if (state.contractInstance) {
        console.log('Loading contract data (action) if condition, state:', state);
        web3util.loadContractData(state.contractInstance, state.contractState)
          .then((result) => { 
            state.loadingFlag = true;
            commit('saveContractData', result); 
          })
          .catch((error) => {
            state.errorFlag = true;
            state.loadingFlag = true;
            state.errorMessage = error.message ? error.message : 'Something went wrong, please check if you have the correct MetaMask account selected for this action and that you are running an instance of ganache';
          });
      }
    },
    async changeSeller( { state, dispatch }, newSellerAddress) {
      console.log('changeSeller (action)', newSellerAddress);
      web3util.changeSeller(state.contractInstance, newSellerAddress)
      .then(() => {
        state.loadingFlag = true;
        dispatch('loadContractData')
      })
      .catch((error) => {
        state.errorFlag = true;
        state.loadingFlag = true;
        state.errorMessage = error.message ? error.message : 'Something went wrong, please check if you have the correct MetaMask account selected for this action and that you are running an instance of ganache';
      });
    },

    async setItem({ state, commit }, { name, price }) {
      if(name = '' || !name) {
        state.errorFlag = true;
        state.errorMessage = 'Empty name is not allowed, please insert a name'
        throw Error('Empty name is not allowed, please insert a name')
      } else if (price === 0 || !price) {
        state.errorFlag = true;
        state.errorMessage = 'Price must not be empty or 0'
        throw Error('Price must not be empty or 0')
      }
      console.log('Set Item account', window.web3.eth.defaultAccount);
      web3util.setItem(state.contractInstance, name.toString(), price.toString())
        .then(() => {
          state.loadingFlag = true;
          commit('setItem', { name, price });
        })
        .catch((error) => {
          state.errorFlag = true;
          state.loadingFlag = true;
          state.errorMessage = error.message ? error.message : 'Something went wrong, please check if you have the correct MetaMask account selected for this action and that you are running an instance of ganache';
        });
    },
    async receivedItem({ state, commit }) {
      web3util.itemReceived(state.contractInstance)
        .then(() => {
          commit('receivedItem');
          state.loadingFlag = true;
          })
        .catch((error) => {
          state.errorFlag = true;
          state.loadingFlag = true;
          state.errorMessage = error.message ? error.message : 'Something went wrong, please check if you have the correct MetaMask account selected for this action and that you are running an instance of ganache';
        });
    },
    async deploy({ commit, dispatch }, { seller, buyer, intermediator }) {
      console.log('mutation deploy called in store', seller, buyer, intermediator);
      web3util.deployContract(seller, buyer, intermediator)
        .then((instance) => {
          state.loadingFlag = true;
          commit('saveContract', instance);
          dispatch('loadInitialData');
        }).catch((error) => {
          state.errorFlag = true;
          state.loadingFlag = true;
          state.errorMessage = error.message ? error.message : 'Something went wrong, please check if you have the correct MetaMask account selected for this action and that you are running an instance of ganache';
        });
    },
    async pay({ dispatch, state }, price) {
      web3util.payItem(state.contractInstance, price)
        .then(() => {
          state.loadingFlag = true;
          dispatch('loadBalance');
      })
        .catch((error) => {
          state.errorFlag = true;
          state.loadingFlag = true;
          state.errorMessage = error.message ? error.message : 'Something went wrong, please check if you have the correct MetaMask account selected for this action and that you are running an instance of ganache';
        });
    },
    async loadBalance({ commit, state }) {
      web3util.getBalance(state.contractInstance)
        .then((balance) => {
          state.loadingFlag = true;
          commit('pay');
          commit('updateBalance', balance);
        })
        .catch((error) => {
          state.errorFlag = true;
          state.loadingFlag = true;
          state.errorMessage = error.message ? error.message : 'Something went wrong, please check if you have the correct MetaMask account selected for this action and that you are running an instance of ganache';
        });
    },
    async withdraw({ commit, state }) {
      web3util.withdraw(state.contractInstance)
        .then(() => {
          state.loadingFlag = true;
          commit('withdraw');
      })
        .catch((error) => {
          state.errorFlag = true;
          state.loadingFlag = true;
          state.errorMessage = error.message ? error.message : 'Something went wrong, please check if you have the correct MetaMask account selected for this action and that you are running an instance of ganache';
        });
    },
    async retract({ dispatch, state }) {
      web3util.retractContract(state.contractInstance)
        .then(() => {
          state.loadingFlag = true;
          dispatch('loadContractData');
      })
        .catch((error) => {
          state.errorFlag = true;
          state.loadingFlag = true;
          state.errorMessage = error.message ? error.message : 'Something went wrong, please check if you have the correct MetaMask account selected for this action and that you are running an instance of ganache';
        });
    },
    async finalizeRetraction({ dispatch, state }, buyerRuledRight) {
      web3util.finalizeRetraction(state.contractInstance, buyerRuledRight)
       .then(() => {
        state.loadingFlag = true;
         dispatch('loadContractData');
        })
       .catch((error) => {
        state.errorFlag = true;
        state.loadingFlag = true;
        state.errorMessage = error.message ? error.message : 'Something went wrong, please check if you have the correct MetaMask account selected for this action and that you are running an instance of ganache';
      });
    },
    async withdrawAfterDisputeBuyer({ dispatch, state }) {
      web3util.withdrawAfterDisputeBuyer(state.contractInstance)
        .then(() => {
          state.loadingFlag = true;
          dispatch('loadContractData');
        })
        .catch((error) => {
          state.errorFlag = true;
          state.loadingFlag = true;
          state.errorMessage = error.message ? error.message : 'Something went wrong, please check if you have the correct MetaMask account selected for this action and that you are running an instance of ganache';
        });
    },
    async withdrawAfterDisputeSeller({ dispatch, state }) {
      web3util.withdrawAfterDisputeSeller(state.contractInstance)
        .then(() => {
          state.loadingFlag = true;
          dispatch('loadContractData');
        })
        .catch((error) => {
          state.errorFlag = true;
          state.loadingFlag = true;
          state.errorMessage = error.message ? error.message : 'Something went wrong, please check if you have the correct MetaMask account selected for this action and that you are running an instance of ganache';
        });
    },
  },
  getters: {
    getItem: state => state.contractState.item,
    getStatus: state => state.contractState.contractClosed,
    getAgreement: state => state.contractState.agreement,
    getBuyerIsPaidBack: state => state.contractState.buyerIsPaidBack,
    getBalance: state => state.contractState.balance,
    getContractAddress: state => state.contractInstance.options.address,
    getItemSet: state => state.contractState.itemIsSet,
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
      console.log('Intial Contract State: ', payload);
    },
    saveContractData(state, payload) {
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
    changeLoadingFlag(state) {
      console.log('state loading flag change mutation')
      state.loadingFlag = false;
    },
    changeErrorFlagAndMessage(state) {
      state.errorFlag = false;
      state.errorMessage = null;
    }
  },
};
