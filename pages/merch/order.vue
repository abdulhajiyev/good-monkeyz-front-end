<template>
  <div class="shop">
    <MinBanner :account="wallet" :active="true" color="black" />
    <div class="heading">
        <h1>Congratulations!</h1> 
        <h2>Order</h2>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers';
import { mapState} from 'vuex'
import JSConfetti from 'js-confetti'

import MinBanner from '@/components/MinBanner.vue';

import monkey from "@/assets/video/mm.mp4";

import GMSHOPJSON from '@/utils/nftShop.json';

import { 
  MERCH_DROP_CONTRACT,
  INFURA_PROJECT_ID,
  NETWORK_NAME,
  TOKEN_ID_MERCH_BUNDLE 
} from '@/utils/constants';


export default {
  transition: 'scale',
  name: 'Complete',
  components: {
    MinBanner,
  },
  data: () => {
    return {
      monkey,
      balance: '',
      orderNumber: '',
    }
  },
  computed: mapState(['wallet']),
  async created() {
    this.orderNumber = this.$route.query.order
    this.fireConfetti()
    console.log( await this.getBalance() )
  },
  methods: {
    async getBalance() {
      
     try {
          const provider = new ethers.providers.InfuraProvider(NETWORK_NAME, INFURA_PROJECT_ID);
          const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, provider);
          const bal = await connectedContract.balanceOf(this.wallet, TOKEN_ID_MERCH_BUNDLE);
          console.log('conected bal:', bal);
          return ethers.utils.formatUnits(bal, 0)
        } catch(error){
            console.error(error);
          return 0;
        }
    },
         fireConfetti(){
       const jsConfetti = new JSConfetti()
        jsConfetti.addConfetti({
          confettiColors: ['#FC9D79', '#D91EA4', '#A31FC5', '#7651C3', '#2CDAB0', '#FFF6B4'],
          confettiRadius: 8,
        });
        setTimeout( ()=> {
          jsConfetti.addConfetti({
            confettiColors: ['#FC9D79', '#D91EA4', '#A31FC5', '#7651C3', '#2CDAB0', '#FFF6B4'],
            confettiRadius: 8,
          });
        }, 700)
        setTimeout( ()=> {
          jsConfetti.addConfetti({
            confettiColors: ['#FC9D79', '#D91EA4', '#A31FC5', '#7651C3', '#2CDAB0', '#FFF6B4'],
            confettiRadius: 8,
          });
        }, 1400)

        setTimeout( ()=> {
          jsConfetti.addConfetti({
            confettiColors: ['#FC9D79', '#D91EA4', '#A31FC5', '#7651C3', '#2CDAB0', '#FFF6B4'],
            confettiRadius: 8,
          });
        }, 2000)

        setTimeout( ()=> {
          jsConfetti.addConfetti({
            confettiColors: ['#FC9D79', '#D91EA4', '#A31FC5', '#7651C3', '#2CDAB0', '#FFF6B4'],
            confettiRadius: 8,
          });
        }, 2400)
     }
  },
  // middleware({ redirect }) {
  //   const balance = 1
  //   console.log('BALANCE: %s', balance)
  //   if (balance < 1) {
  //     return redirect('/ngmi');
  //   }
  // }

}
</script>

<style scoped>
.scale-enter-active, .scale-leave-active { 
  transition: opacity 1s, transform .5s; 
}
.scale-enter, .scale-leave-active { 
  opacity: 0;
  transform: scale(0.95);
}

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
  text-decoration: none;
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
