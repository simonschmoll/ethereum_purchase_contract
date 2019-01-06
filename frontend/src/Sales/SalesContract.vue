<template>
<div>
  <div class="SalesContract">
      <div class="account">Your connected account is: {{web3.coinbase}}</div>
      <div class="account">Contract Balance: {{contract.balance}}</div>
  <table v-if="contract.item !== null && contract.item.name !== ''">
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
      <td>{{contract.item.name}}</td>
      <td>{{contract.item.price}}</td>
    </tbody>
  </table>
  <hr>
  <div class="seller">
    <h1>Actions Seller:</h1>
    <table>
      <thead>
        <th>Set Item</th>
      </thead>
      <tbody>
        <td> Name: <input v-model="itemName" type="text" name="ItemName"><br>
          Price: <input v-model="itemPrice" type="text" name="ItemPrice"><br>
          <button @click="sendItem()">Submit</button>
         </td>
      </tbody>
    </table>
  </div>
  </div>
  <footer>
    <p>Your coinbase account from Metamask: {{web3.coinbase}}</p>
  </footer>
</div>
</template>

<script>
export default {
  name: 'SalesContract',
  data() {
    return {
      itemName: '',
      itemPrice: 0,
    };
  },
  computed: {
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
  },
};

</script>

<style>
table, th, td {
  border: 1px solid black;
}

th, td {
  padding: 10px;
}

table {
  margin-top: 50px;
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
</style>
