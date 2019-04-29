<template>
  <div>
    <h1>Deploy and initialize contract</h1>
    <v-container fluid grid-list-xl fill-height>
      <v-layout>
        <v-flex md4>
          <v-card color="secondary">
          <v-card-title primary-title>
            <div>
              <h3 class="display-1 mb-3">Deploy</h3>
              <div>
                <v-text-field label="Address Seller" v-model="addrSeller"
                  name="seller"></v-text-field>
                <v-text-field label="Address Buyer" v-model="addrBuyer"
                name="buyer"></v-text-field>
                <v-text-field label="Address Intermediator" v-model="addrIntermediator"
                name="intermediator"></v-text-field>
              </div>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-btn :loading="deployloader" :disabled="deployButtonDisabled"
            block large color="primary" @click="deployContract();loader='deployloader'">Deploy
            <v-icon color="info" x-large right>cloud_upload</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
        </v-flex>
        <v-flex md4>
          <v-card color="secondary">
          <v-card-title primary-title>
            <div>
              <h3 class="display-1 mb-3">Connect to contract</h3>
              <div>
              <v-text-field label="Contract Address" v-model="contractAddress"
                name="intermediator"></v-text-field>
            </div>
            </div>

          </v-card-title>
          <v-card-actions>
            <v-btn
            :loading="connectloader" :disabled="connectloader"
            block large color="primary"
            @click="connectToContract();loader = 'connectloader'">Connect
            <v-icon color="info" x-large right>rss_feed</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'deploy',
  data() {
    return {
      loader: null,
      deployloader: false,
      initloader: false,
      connectloader: false,
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
  computed: {
    deployed() {
      console.log('Deployed contract?', this.$store.state.web3Module.deployedContract);
      return this.$store.state.web3Module.deployedContract;
    },
    loadingFlag() {
      return this.$store.state.web3Module.loadingFlag;
    },
    deployButtonDisabled() {
      return this.deployloader || Boolean(this.deployed);
    },
  },
  watch: {
    loader() {
      const l = this.loader;
      console.log('Load called');

      this[l] = !this[l];

      setTimeout(() => {
        (this[l] = false);
      }, 35000);

      this.loader = null;
    },
    loadingFlag() {
      if (this.loadingFlag) {
        this.$store.commit('changeLoadingFlag');
        this.deployloader = false;
        this.initloader = false;
        this.connectloader = false;
      }
    },
  },
};
</script>

<style scoped>

h1 {
  font-size: 24pt;
}


</style>
