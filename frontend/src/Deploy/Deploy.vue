<template>
  <div>
    <h1>Deploy Contract first:</h1>
    <table>
      <thead>
        <th>Deploy</th>
      </thead>
      <tbody>
        <td> Address Seller: <input v-model="addrSeller" type="text"
          name="ItemName" class="input-con"><br>
          Address Buyer: <input v-model="addrBuyer" type="text"
            name="ItemPrice" class="input-con"><br>
          Address Intermediator:
          <input v-model="addrIntermediator" type="text" name="ItemPrice" class="input-con"><br>
          <button class="button buttonBuyer" @click="deployContract()">Submit</button>
         </td>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'deploy',
  data() {
    return {
      addrSeller: 0,
      addrBuyer: 0,
      addrIntermediator: 0,
    };
  },
  methods: {
    deployContract() {
      const buyer = this.addrBuyer;
      const intermediator = this.addrIntermediator;
      const seller = this.addrSeller;
      console.log('Sending deploy data to store: ', seller, buyer, intermediator);
      this.$store.dispatch('deploy', { seller, buyer, intermediator });
    },
  },
  computed: {
    getAddr() {
      return this.$store.state.web3Module.web3Address;
    },
  },

};
</script>

<style scoped>
.input-con {
  width: 500px;
  font-size: 20pt;
  margin-bottom: 5px;
}

td, th {
  font-size: 20pt;
}

h1 {
  font-size: 24pt;
}


</style>
