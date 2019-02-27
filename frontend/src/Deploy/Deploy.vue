<template>
  <div>
    <h1>Deploy Contract first:</h1>
    <table>
      <thead>
        <th>Deploy</th>
        <th>Connect to existing Contract</th>
      </thead>
      <tbody>
        <td> Address Seller: <input v-model="addrSeller" type="text"
          name="seller" class="input-con"><br>
          Address Buyer: <input v-model="addrBuyer" type="text"
            name="buyer" class="input-con"><br>
          Address Intermediator:
          <input v-model="addrIntermediator" type="text" name="intermediator" class="input-con"><br>
          <button class="button buttonBuyer" @click="deployContract()">Deploy</button>
         </td>
         <td>
           <input v-model="contractAddress" type="text" name="ContractAddr" class="input-con"><br>
          <button class="button buttonBuyer" @click="connectToContract()">Connect</button>
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
      addrSeller: null,
      addrBuyer: null,
      addrIntermediator: null,
      contractAddress: null,
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
    connectToContract() {
      const contractAddr = this.contractAddress;
      this.$store.dispatch('connectToContract', { contractAddr });
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
