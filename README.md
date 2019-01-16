# This is an example implementation of a sale contract between two parties

## Local setup

## NPM
You need to have npm installed to work with this implementation.  
It is recommended to use a node version manager such as nvm  (https://github.com/creationix/nvm) to install npm

## Ganache
Start your own local ethereum blockchain with the ganache tool (available at https://github.com/trufflesuite/ganache-cli)


After installing ganache-cli start your client with:  
`ganache-cli -e 10000`  
Optionally, you can also download the GUI version of Ganache, this will persist the state throughout your sessions
Note: the optional parameter `-e 10000` gives all the addresses 10000 Ether instead of 100. This is preferable if you want test the code.  
Please make sure that ganache runs at http://127.0.0.1:8545

## Truffle test suit
Get truffle at: https://truffleframework.com/truffle

After installing all the necessary tools, please run:  

`npm install`  

from the root directory  
  

## Migrate contract and start tests
**OPTIONAL, only if you want to explore the contracts more in depth and run the tests --> Frontend will interact with the contract**  

To migrate the contract use:  
`truffle migrate` from the root directory  
To start the tests use:  
`truffle test` from the root directory or to run specific tests you can specify the location of a test after the command

## Start Frontend
To start the frontend please run  
  
`npm start`  

now you can interact with the contract at http://localhost:8082/

# Quick start
(Pre condition: npm, ganache)  
`npm install`  
`npm start`