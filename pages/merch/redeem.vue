<template>
  <div class="shop">
    <Menu :account="wallet"/>
    <div class="heading">
        <h1>You're in! LFG </h1>
        <h2>You are eligible for the Good Monkeyz merch drop</h2>
    </div>
    <div class="grid">
      <div class="item">
        <video muted autoplay loop :src="monkey"></video>
        <nuxt-link to="/merch/redeem" class="btn">Redeem Item</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers';
import { mapState} from 'vuex'

import Menu from '@/components/Menu.vue';

import monkey from "@/assets/video/mm.mp4";

import nftShop from '@/utils/nftShop.json';

export default {
  name: 'Dashboard',
  components: {
    Menu,
  },
  data: () => {
    return {
      monkey,
      balance: '',
    }
  },
  computed: mapState(['wallet']),
  created() {
  },
  methods: {
      async getBalance() {

      try {
        const { ethereum } = window;

        const CONTRACT_ADDRESS = "0x5958C4757564163d97941aC95Bf321232C52193D";

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, nftShop.abi, signer);

          return await connectedContract.balanceOf(this.wallet, 1);
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error)
      }

    },
  },
  middleware({ redirect }) {
    const balance = this.getBalance();
    console.log('BALANCE: %s', balance)
    if (balance > 0) {
      return redirect('/ngmi');
    }

  }

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


