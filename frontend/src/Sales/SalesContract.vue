<template>
<div>
  <div class="SalesContract">
      <p class="account">Contract Balance: {{contract.balance}}</p>
  <table>
    <thead>
      <tr>
        <th>Seller</th>
        <th>Buyer</th>
        <th>Intermediator</th>
        <th>Itemname</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      <td>{{contract.seller}}</td>
      <td>{{contract.buyer}}</td>
      <td>{{contract.intermediator}}</td>
      <td>{{getItem.name}}</td>
      <td>{{getItem.price}}</td>
    </tbody>
  </table>
  <table>
    <thead>
      <tr>
        <th>Paid?</th>
        <th>Received?</th>
        <th>Closed?</th>
      </tr>
    </thead>
    <tbody>
      <td v-if="getItem.itemPaid===false" style="background-color: #F66666">No</td>
      <td v-else style="background-color: green">Yes</td>
      <td v-if="getItem.itemReceived===false" style="background-color: #F66666">No</td>
      <td v-else style="background-color: green">Yes</td>
      <td v-if="getStatus===true" style="background-color: #F66666">Closed</td>
      <td v-else style="background-color: green">Open</td>

    </tbody>
  </table>
  <hr>
  <div class="seller">
    <h1>Actions Seller:</h1>
    <table class="inlineTable">
      <thead>
        <th>Set Item</th>
      </thead>
      <tbody>
        <td> Name: <input v-model="itemName" type="text" name="ItemName"><br>
          Price: <input v-model="itemPrice" type="text" name="ItemPrice"><br>
          <button class="button buttonSubmit" @click="sendItem()">Submit</button>
         </td>
      </tbody>
    </table>
    <table class="inlineTable secondTable">
        <td>
          <button class="button buttonSubmit" @click="withdraw()">Withdraw</button>
         </td>
    </table>
  </div>
  <div class="seller">
    <h1>Actions Buyer:</h1>
    <table class="inlineTable">
      <thead>
        <th>Received Item</th>
      </thead>
      <tbody>
        <td>
          <button class="button buttonReceive" @click="received()">Received Item</button>
         </td>
      </tbody>
    </table>
    <table class="inlineTable secondTable">
      <thead>
        <th>Pay Item</th>
      </thead>
      <tbody>
        <td>
          Price: <strong>{{getItem.price}}</strong> <br>
          <button class="button buttonPay" @click="pay(getItem.price)">Pay Item</button>
         </td>
      </tbody>
    </table>
  </div>
  </div>
  <footer>
    <p>Your current account from Metamask: {{web3.currentAccount}}</p>
  </footer>
</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SalesContract',
  data() {
    return {
      itemName: '',
      itemPrice: 0,
    };
  },
  computed: {
    ...mapGetters({
      getItem: 'getItem',
      getStatus: 'getStatus',
    }),
    web3() {
      console.log('Returning web 3 as', this.$store.state.web3Module.web3);
      return this.$store.state.web3Module.web3;
    },
    contract() {
      console.log('Returning contract instance', this.$store.state.web3Module.contractState);
      return this.$store.state.web3Module.contractState;
    },
  },
  methods: {
    // ...mapActions('web3Module', ['setItem']),
    sendItem() {
      const name = this.itemName;
      const price = this.itemPrice.toString();
      console.log('Item price in sendItem:', price);
      this.$store.dispatch('setItem', { name, price });
    },
    received() {
      console.log('received called from component');
      this.$store.dispatch('receivedItem');
    },
    pay(price) {
      console.log('User wants to pay item (SalesContract)');
      this.$store.dispatch('pay', price);
    },
    withdraw() {
      console.log('User wants to withdraw money');
      this.$store.dispatch('withdraw');
    },
  },
};

</script>

<style>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
}

table {
  margin: 5px;
  margin-top: 30px;
}

h1 {
  font-size: 20px;
}

.seller {
  margin-top: 30px;
  width: 100%;
  border: 1px solid black;
  background: grey;
}

footer {
  position: fixed;
  width: 100%;
  bottom: 10px;
  text-align: center;
}

hr {
  background-color: black;
  margin-top: 30px;
  height: 1px;
  border: 0;
}

input {
  background-color: whitesmoke;
}

input[type=text]:focus {
  background-color: lightgrey;
}

button {
  color: white;
  padding: 15px 32px;
  text-align: center;
  margin-top: 5px;
  position: center;
  cursor: pointer;
  display: inline-block;
}

.buttonReceive, .buttonPay {
  background-color: rgb(125, 180, 126)
}

.buttonSubmit {
  background-color: rgb(243, 147, 147)
}

.inlineTable {
  display: inline-block;
}

.secondTable {
  margin-left: 20%;
}


</style>
