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

      if (state.contractInstance) {
        dispatch('loadContractData')
      }
    },
    async loadContractData({ state, commit }) {
      if (state.contractInstance) {
        web3util.loadContractData(state.contractInstance, state.contractState)
          .then((result) => { 
            state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
            commit('saveContractData', result); 
          })
          .catch((error) => {
            state.errorFlag = true;
            state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
            state.errorMessage = error.message ? error.message : 'Something went wrong, please check if you have the correct MetaMask account selected for this action and that you are running an instance of ganache';
          });
      }
    },
    async changeSeller( { state, dispatch }, newSellerAddress) {
      web3util.changeSeller(state.contractInstance, newSellerAddress)
      .then(() => {
        state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
        dispatch('loadContractData')
      })
      .catch((error) => {
        state.errorFlag = true;
        state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
        state.errorMessage = error.message ? error.message : 'Something went wrong, please check if you have the correct MetaMask account selected for this action and that you are running an instance of ganache';
      });
    },

    async setItem({ state, dispatch }, { name, price }) {
      if(name === '' || !name) {
        state.errorFlag = true;
        state.errorMessage = 'Empty name is not allowed, please insert a name'
        throw Error('Empty name is not allowed, please insert a name')
      } else if (price === 0 || !price) {
        state.errorFlag = true;
        state.errorMessage = 'Price must not be empty or 0'
        throw Error('Price must not be empty or 0')
      }
      web3util.setItem(state.contractInstance, name, price)
        .then(() => {
          state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
          dispatch('loadContractData');
        })
        .catch((error) => {
          state.errorFlag = true;
          state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
          state.errorMessage = error.message ? error.message : 'Something went wrong, please check if you have the correct MetaMask account selected for this action and that you are running an instance of ganache';
        });
    },
    async receivedItem({ state, dispatch }) {
      web3util.itemReceived(state.contractInstance)
        .then(() => {
          state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
          dispatch('loadContractData');
          })
        .catch((error) => {
          state.errorFlag = true;
          state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
          state.errorMessage = error.message ? error.message : 'Something went wrong, please check if you have the correct MetaMask account selected for this action and that you are running an instance of ganache';
        });
    },
    async deploy({ state, commit, dispatch }, { seller, buyer, intermediator }) {
      web3util.deployContract(seller, buyer, intermediator)
        .then((instance) => {
          state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
          commit('saveContract', instance);
          dispatch('loadInitialData');
        }).catch((error) => {
          state.errorFlag = true;
          state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
          state.errorMessage = error.message ? error.message : 'Something went wrong, please check if you have the correct MetaMask account selected for this action and that you are running an instance of ganache';
        });
    },
    async pay({ dispatch, state }, price) {
      web3util.payItem(state.contractInstance, price)
        .then(() => {
          state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
          dispatch('loadContractData');
      })
        .catch((error) => {
          state.errorFlag = true;
          state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
          state.errorMessage = error.message ? error.message : 'Something went wrong, please check if you have the correct MetaMask account selected for this action and that you are running an instance of ganache';
        });
    },
    async loadBalance({ dispatch, state }) {
      web3util.getBalance(state.contractInstance)
        .then((balance) => {
          state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
          dispatch('loadContractData');
        })
        .catch((error) => {
          state.errorFlag = true;
          state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
          state.errorMessage = error.message ? error.message : 'Something went wrong, please check if you have the correct MetaMask account selected for this action and that you are running an instance of ganache';
        });
    },
    async withdraw({ dispatch, state }) {
      web3util.withdraw(state.contractInstance)
        .then(() => {
          state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
          dispatch('loadContractData');
      })
        .catch((error) => {
          state.errorFlag = true;
          state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
          state.errorMessage = error.message ? error.message : 'Something went wrong, please check if you have the correct MetaMask account selected for this action and that you are running an instance of ganache';
        });
    },
    async retract({ dispatch, state }) {
      web3util.retractContract(state.contractInstance)
        .then(() => {
          state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
          dispatch('loadContractData');
      })
        .catch((error) => {
          state.errorFlag = true;
          state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
          state.errorMessage = error.message ? error.message : 'Something went wrong, please check if you have the correct MetaMask account selected for this action and that you are running an instance of ganache';
        });
    },
    async finalizeRetraction({ dispatch, state }, buyerRuledRight) {
      web3util.finalizeRetraction(state.contractInstance, buyerRuledRight)
       .then(() => {
        state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
         dispatch('loadContractData');
        })
       .catch((error) => {
        state.errorFlag = true;
        state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
        state.errorMessage = error.message ? error.message : 'Something went wrong, please check if you have the correct MetaMask account selected for this action and that you are running an instance of ganache';
      });
    },
    async withdrawAfterDisputeBuyer({ dispatch, state }) {
      web3util.withdrawAfterDisputeBuyer(state.contractInstance)
        .then(() => {
          state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
          dispatch('loadContractData');
        })
        .catch((error) => {
          state.errorFlag = true;
          state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
          state.errorMessage = error.message ? error.message : 'Something went wrong, please check if you have the correct MetaMask account selected for this action and that you are running an instance of ganache';
        });
    },
    async withdrawAfterDisputeSeller({ dispatch, state }) {
      web3util.withdrawAfterDisputeSeller(state.contractInstance)
        .then(() => {
          state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
          dispatch('loadContractData');
        })
        .catch((error) => {
          state.errorFlag = true;
          state.loadingFlag = Object.assign({}, state.loadingFlag, state.loadingFlag = true);
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
    getContractAddress: state => state.contractInstance ? state.contractInstance.options.address : undefined,
    getItemSet: state => state.contractState.itemIsSet,
  },
  mutations: {
    saveContract(state, payload) {
      state.contractInstance = payload;
    },
    saveContractData(state, payload) {
      state.contractState = payload;
    },
    changeLoadingFlag(state) {
      state.loadingFlag = false;
    },
    changeErrorFlagAndMessage(state) {
      state.errorFlag = false;
      state.errorMessage = null;
    }
  },
};
