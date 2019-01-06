import Web3 from 'web3';

const getWeb3 = new Promise(((resolve, reject) => {
  const web3js = window.web3;
  let web3;
  if (typeof web3js !== 'undefined') {
    web3 = new Web3(web3js.currentProvider);
  } else {
    // Connect to ganache
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  }
  reject(new Error('Something went wrong dude'));
  resolve({
    injectedWeb3: web3.isConnected(),
    web3() {
      return web3;
    },
  });
}))
  .then(result => new Promise(((resolve, reject) => {
    // Retrieve network ID
    result.web3().version.getNetwork((err, networkId) => {
      if (err) {
        // If we can't find a networkId keep result the same and reject the promise
        reject(new Error('Unable to retrieve network ID'));
      } else {
        // Assign the networkId property to our result and resolve promise
        result = Object.assign({}, result, { networkId });
        resolve(result);
      }
    });
  })))
  .then(result => new Promise(((resolve, reject) => {
    // Retrieve coinbase
    result.web3().eth.getCoinbase((err, coinbase) => {
      if (err) {
        reject(new Error('Unable to retrieve coinbase'));
      } else {
        result = Object.assign({}, result, { coinbase });
        resolve(result);
      }
    });
  })))
  .then(result => new Promise(((resolve, reject) => {
    // Retrieve balance for coinbase
    result.web3().eth.getBalance(result.coinbase, (err, balance) => {
      if (err) {
        reject(new Error(`Unable to retrieve balance for address: ${result.coinbase}`));
      } else {
        result = Object.assign({}, result, { balance });
        resolve(result);
      }
    });
  })));

export default { getWeb3 };
