<template>
  <div class="shop">
    <div class="nav">
      <MinBanner :account="wallet" :active="true" color="black" />
    </div>
    <div v-if="wallet" class="heading">
        <h1>You're in! LFG </h1> 
        <h2>You are eligible for the Good Monkeyz merch drop</h2>
    </div>
    <div v-if="wallet" class="grid">
      <div v-if="bal>0" class="item">
        <video muted autoplay loop :src="monkey"></video>
        <nuxt-link to="/merch/options" class="btn">Redeem Item</nuxt-link>
      </div>
      <div v-if="order" class="item">
        <video muted autoplay loop :src="monkey"></video>
        <span v-if="order === 'pending'" to="/merch/options" class="btn">Pending Order</span>
        <nuxt-link v-if="order === true" :to="`/merch/order?order=${orderNumber}`" class="btn">View Order</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers';
import { mapState} from 'vuex'

import MinBanner from '@/components/MinBanner.vue';
import monkey from "@/assets/video/mm-med.mp4";
import GMSHOPJSON from '@/utils/nftShop.json';

import { 
  MERCH_DROP_CONTRACT,
  INFURA_PROJECT_ID,
  NETWORK_NAME,
  TOKEN_ID_MERCH_BUNDLE 
} from '@/utils/constants';

export default {
  transition: 'scale',
  name: 'Redeem',
  middleware: 'merchOwner',
  components: {
    MinBanner,
  },
  data: () => {
    return {
      monkey,
      order: false,
      bal: 0,
      orderNumber: 0,
    }
  },
  computed: { 
    ...mapState(['wallet']),
  },
  async created(){
    
    if(this.wallet){
      await this.checkOrder(this.wallet)
    } else {
        setTimeout( () => {
        if(!this.wallet){
          this.$nuxt.$emit('connect', '/merch/redeem')
        } else{
          this.checkOrder(this.wallet)
        }
      },1500)
    }

    this.$nuxt.$on('web3-active', async () => {
      await this.checkOrder(this.wallet)
      this.ngmiRedirect()
      console.log('web 3 actyive');
    })
  },
  methods: {
    async ngmiRedirect() {
      try {
        const bal = await this.getBalance()
        if (this.wallet && bal < 1 && !this.order) {
            return this.$router.push('/ngmi');
        } else{
          console.log('abc')
        }
      } catch(error){
        console.error(error);
        return 0;
      }
    },
    async getBalance() {
     try {
        const provider = new ethers.providers.InfuraProvider(NETWORK_NAME, INFURA_PROJECT_ID);
        const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, provider);
        const balBig = await connectedContract.balanceOf(this.wallet, TOKEN_ID_MERCH_BUNDLE);
        this.bal = ethers.utils.formatUnits(balBig, 0);
        return ethers.utils.formatUnits(balBig, 0)
      } catch(error){
          console.error(error);
        return 0;
      }
    },
    async checkOrder(address){
      const res = await (await fetch(`/.netlify/functions/reload-order?address=${address}`)).json()
      this.bal = await this.getBalance();
      this.order = res.order;
      this.orderNumber = res.id;
    },
  }
}
</script>

<style scoped lang="scss">
$s: 660px;
$m: 960px;
$l: 1720px;

.scale-enter-active, .scale-leave-active { 
  transition: opacity 0.6s, transform .5s; 
}
.scale-enter, .scale-leave-active { 
  opacity: 0;
  transform: scale(0.95);
}

main {
  background: #fff;
}
.nav {
  margin: 1.5rem;
  position: relative;
}
.grid {
  display: flex;
  justify-content: center;
}

.item {
  max-width: 80%;
  margin: 1rem;
  padding: 1rem;
  border-radius: 2rem;
  box-shadow: 0px 34px 84px rgba(0, 0, 0, 0.09);
  position: relative;
  @media (min-width: $s) {
      max-width: 50%;
  }
  @media (min-width: $m) {
      max-width: 25%;
  }
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
  text-decoration: none;
}

.heading {
  padding: 8rem 0 0;
  text-align: center;

  @media (min-width: $m) {
    padding: 6rem 0 2rem;
  }
}
.heading h1 {
  font-size: 2.2rem;
  text-transform: uppercase;
  margin: 0;

  @media (min-width: $m) {
    font-size: 3.2rem;
  }
  @media (min-width: $m) {
    font-size: 4rem;
  }
}
.heading h2 {
    margin-top: 0.5rem;
    font-family: Helvetica, sans-serif;
    font-size: 0.9rem;
    font-weight: 300;

    @media (min-width: $m) {
      margin: 0;
      font-size: 1.0rem;
    }
    @media (min-width: $m) {
      font-size: 1.0rem;
    }
}

</style>


