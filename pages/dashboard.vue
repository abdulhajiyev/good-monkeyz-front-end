<template>
  <div class="shop">
    <Menu :account="wallet"/>
    <div class="heading">
        <h1>You're in! LFG </h1>
        <h2>You are eligible for the Good Monkeyz merch drop</h2>
    </div>
    <div class="grid">
      <div v-if="merchBundleNFT" class="item">
        <video muted autoplay loop :src="monkey"></video>
        <span class="btn">Merch Bundle</span>
        <!-- <nuxt-link to="/merch/redeem" class="btn">Redeem Item</nuxt-link> -->
      </div>
      <div v-if="mintPassNFT" class="item">
        <video muted autoplay loop :src="monkey"></video>
        <span class="btn">Mint Pass</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers';
import { mapState} from 'vuex'

import Menu from '@/components/Menu.vue';

import monkey from "@/assets/video/mm.mp4";

import GMSHOPJSON from '@/utils/nftShop.json';

import { 
  MERCH_DROP_CONTRACT,
  INFURA_PROJECT_ID,
  NETWORK_NAME,
  TOKEN_ID_MERCH_BUNDLE 
} from '@/utils/constants';


export default {
  name: 'Dashboard',
  components: {
    Menu,
  },
  data: () => {
    return {
      monkey,
      merchBundleNFT: 0,
      mintPassNFT: 0,
    }
  },
  computed: mapState(['wallet']),
  created() {
    this.getBalance();
  },
  methods: {
      getBalance() {
      const provider = new ethers.providers.InfuraProvider(NETWORK_NAME, INFURA_PROJECT_ID);
      const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, provider);
      this.merchBundleNFT = connectedContract.balanceOf(this.wallet, TOKEN_ID_MERCH_BUNDLE);
      this.mintPassNFT = connectedContract.balanceOf(this.wallet, 1);
      if (this.merchBundleNFT <= 0 && this.mintPassNFT <= 0 ) {
        this.$router.push('/ngmi')
      }
    },
  },
}
</script>

<style scoped>
main {
  background: #fff;
}

.grid {
  display: flex;
  justify-content: center;
}

.item {
  max-width: 25%;
  margin: 1rem;
  padding: 1rem;
  border-radius: 2rem;
  box-shadow: 0px 34px 84px rgba(0, 0, 0, 0.09);
  position: relative;
}

.item video{
  max-width: 100%;
  border-radius: 1rem;
  margin-bottom: 1rem;
}

.item .btn {
  background-color: #000;
  color: #fff;
  text-align: center;
  display: block;
  border-radius: 1rem;
  font-size: 0.75rem;
  padding: 0.5rem;
  cursor: pointer;
  text-transform: uppercase;
}
.item .supply {
  position: absolute;
  color: #fff;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 1;
}


.heading {
    padding: 6rem 0 2rem;
    text-align: center;
}
.heading h1 {
    font-size: 4rem;
    text-transform: uppercase;
    margin: 0;
}
.heading h2 {
    margin: 0;
    font-family: Helvetica, sans-serif;
    font-size: 1.0rem;
    font-weight: 300;
}

</style>


