# This is an example implementation of a sale contract between two parties

## Local setup

## NPM
You need to have npm installed to work with truffle and ganache.
It is recommended to use a node version manager such as nvm (https://github.com/creationix/nvm) to install npm

### Ganache
Start your own local blockchain with the ganache tool (available at https://github.com/trufflesuite/ganache-cli)

After installing ganache-cli start your client with:
`ganache-cli -e 10000`
Note: the optional parameter `-e 10000` gives all the addresses 10000 Ether instead of 100. This is preferable for testing the code.

### Truffle test suit
Get truffle at: https://truffleframework.com/truffle

After installing all the necessary tools, please run `npm install` from the root directory

### Migrate contract and start tests
To migrate the contract use `truffle migrate` from the root directory
To start the tests use `truffle test` from the root directory or to run specific tests you can specify the location of a test after the command