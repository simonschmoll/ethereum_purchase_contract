import Vue from 'vue';
import Vuex from 'vuex';
import web3Store from './modules/web3store';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  modules: {
    web3Module: web3Store,
  },
  getters: {
  },
});
