# This is an example implementation of a sale contract between two parties

**This was just for demonstration purpose build, dependencies are not updated. Use at your own risk**

**DISCLAIMER: This smart contract setup is not intended for production use, rather as an experimental setup 
to facilitate the understanding of Ethereum and the underlying principles. DO NOT USE this code in production or deploy it 
to the main network, as any Ethereum locked into the contract might be exposed to security risks. The code was not audited and 
must only be used for educational purposes.**

## Regular Flow
![](instructions.gif)

## Contract Functionality
This example is intended to provide a sales contract between two parties which will be called seller and buyer from here on. Another actor is the intermediator which will be called upon resolution of a dispute. After running the instantiation script, the contract will be deployed. Next, all parties can interact with the contract. The buyer can set an item which he wants to sell to the buyer. After setting the item, the buyer can pay, and after he received the item, he can mark it as received. However, the seller can only withdraw the money after the buyer has marked the item as received. Now you may ask what happens if there is a dispute or the buyer vanishes. Then there is the possibility that the intermediator (some judge or juristic institution) and the seller can retract the contract, in which case the seller gets his money back. This scenario also works the other way around, if the buyer is ruled correct and the seller tried to scam him, then the buyer and the intermediator can retract the contract. In which case the buyer can withdraw the money.   
Of course, this setup introduces problems such as a 2-1 plot against either the buyer or the seller. Thus, this concept requires a trusted third party. Furthermore, edge cases such as the refund for a damaged item and so on are not covered by the contract. However, it is impossible to consider every exception which might occur in real life. That is why smart contracts should be backed by a legal binding contract. Nonetheless, this scenario demonstrates a very convenient use case of smart contracts. The implementation should be viewed as educational and not production ready.

## Local setup

## NPM
You need to have npm installed to work with this implementation.  
It is recommended to use a node version manager such as nvm  (https://github.com/creationix/nvm) to install npm

## Ganache (v1.2.1)
Start your own local ethereum blockchain with the ganache tool (available at https://github.com/trufflesuite/ganache-cli)


After installing ganache-cli start your client with:  
`ganache-cli -e 10000`  
Optionally, you can also download the GUI version of Ganache, this will persist the state throughout your sessions
Note: the optional parameter `-e 10000` gives all the addresses 10000 Ether instead of 100. This is preferable if you want test the code.  
Please make sure that ganache runs at http://127.0.0.1:8545

## Truffle test suit (v5.0.0-beta.2)
Get truffle at: https://truffleframework.com/truffle

After installing all the necessary tools, please run:  

`npm install`  

from the root directory  
  

## Migrate contract and start tests
**OPTIONAL, only if you want to explore the contracts more in depth and run the tests --> Frontend will interact with the contract**  

To migrate the contract use:  
`truffle migrate` from the root directory  
**For testing you need to have a local instance of Ganache running**  
To start the tests use:  
`truffle test` from the root directory or to run specific tests you can specify the location of a test after the command

## Start Frontend
**Make sure Ganache is running**

To start the frontend please run  
  
`npm start`  

now you can interact with the contract at http://localhost:8082/

**Important**
### MetaMask

To interact with the contract you must use MetaMask as the web3 provider.
Install MetaMask as a browser extension: https://metamask.io/
Or use Brave which has also a MetaMask integration (and provides better privacy)

Next create a wallet in MetaMask (open MetaMask and follow the instructions)

Steps necessary: 
- Open the MetaMask extension
- In privacy settings turn of privacy mode because otherwise the application is not capable of interacting with MetaMask
Don't forget to turn it on again, if you use MetaMask for the main network. This is just for testing purposes.
- Import three accounts from the current Ethereum instance
  - Therefore open Ganache and copy the private key of an account
  - In MetaMask click in the right corner and select 'Import Account'
  - Paste the private key into the input field
  - Repeat this instruction 2 more times
- Now you should have imported 3 different accounts (in total there a now 4 accounts in MetaMask - with the default account included)

Repeat 3 times:
![](metaMaskInstruction.gif)

You are ready to interact with the contract.  
Go to http://localhost:8082/  

Deployment:
The standard flow is as follows:
- Insert the addresses of the 3 imported addresses into the 3 different fields 'seller', 'buyer', 'intermediator'
- Select the account of the address of seller in MetaMask and press 'Deploy'. If you do not choose the account of the seller to deploy the contract will not be instantiated. This is because only the owner of the address of 'seller' can deploy the contract.

**Hint: You can rename accounts in MetaMask, press the menu icon --> next the 'details' button --> now you can change the name on the top**
- After pressing the button 'Deploy', these addresses will be associated with the respective sales position
- Next a popup should be displayed where you have to accept the transaction, afterwards the contract is deployed on the local chain (ganache)

### Intended steps for interaction: 
**Everytime you select a action, make sure the right account is selected in MetaMask**

- Set Item (Seller)
- Pay Item (Buyer)
- Received Item (Buyer)
- Withdraw (Seller)

Other actions:
- Retract (Seller, Buyer, Intermediator - in favor of Buyer or Seller)
- Withdraw (Buyer) - after dispute the buyer can withdraw the money if he is ruled right

# Quick start
(Pre condition: npm, ganache)  
`npm install`  
`npm start`
