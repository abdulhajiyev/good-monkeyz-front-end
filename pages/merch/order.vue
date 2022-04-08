<template>
  <div class="shop">
    <div clas="nav"><MinBanner :account="wallet" :active="true" color="black" class="nav" /></div>
    <div class="heading">
        <img :src="gmBlack" class="logo">
        <h1>Thank You!</h1> 
        <h2>Order Number {{orderNumber}} Complete</h2>
        <p>You’ll recieve an email with further instructions around delivery date and time</p> 
        <a :href="shareLink" class="btn"><img :src="twitter">Share On Twitter</a>
    </div>
  </div>
</template>

<script>
import { mapState} from 'vuex'
import JSConfetti from 'js-confetti'

import { ethers } from 'ethers';
import GMSHOPJSON from '@/utils/nftShop.json';

import MinBanner from '@/components/MinBanner.vue';

import gmBlack from "@/assets/img/gm-circle-black.svg"
import twitter from "@/assets/img/twitter.svg"

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
      gmBlack,
      twitter,
      balance: '',
      orderNumber: '',
      shareLink: `https://twitter.com/share?text=I just burned the GM Merch Bundle&url=https://opensea.io/collection/good-monkeyz-limited-editions&hashtags=goodmonkeyz`,
    }
  },
  computed: mapState(['wallet']),
  created() {
    this.orderNumber = this.$route.query.order
    this.fireConfetti()
    this.$nuxt.$on('web3-active', () => {
      this.ngmiRedirect()
    })
  },
  methods: {
    async ngmiRedirect() {
        try {
            const bal = await this.getBalance()
            if (this.wallet && bal < 1) {
                return this.$router.push('/ngmi');
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
          return ethers.utils.formatUnits(balBig, 0)
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
}
</script>

<style scoped lang="scss">
$s: 660px;
$m: 960px;
$l: 1720px;

.scale-enter-active, .scale-leave-active { 
  transition: opacity 0.3s, transform .5s; 
}
.scale-enter, .scale-leave-active { 
  opacity: 0;
  transform: scale(0.94);
}

.nav {
  margin: 1.5rem;
  position: relative;
}

.logo {
  margin-bottom: 2rem;
  max-width: 6rem;

  @media (min-width: $s) {
    display: inline;
    max-width: 8rem;
  }
  @media (min-width: $m) {
    max-width: 10rem;
  }
}
.heading {
    text-align: center;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 10rem 0.5rem 2rem;

    @media (min-width: $s) {
      padding: 4rem 1rem
    }
    @media (min-width: $m) {
      padding: 2rem;
    }
}
.heading h1,
.heading h2 {
    font-size: 2rem;
    text-transform: uppercase;
    margin: 0;

    @media (min-width: $s) {
     font-size: 3rem;
    }
    @media (min-width: $m) {
      font-size: 4rem;
    }
}

.heading p {
    margin-bottom: 2rem;
    font-family: Helvetica, sans-serif;
    font-size: 1.0rem;
    font-weight: 300;
}

.btn {
  background: #000;
  color: #fff;
  padding: 1rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  font-size: 0.7rem;
  cursor: pointer;
  text-decoration: none;
}
.btn img{
  margin-right: 0.5rem;
  height: 1.1rem;
}

  /* animations */
  .nav {
    opacity: 0;
    animation: enter 1s ease 1 forwards;
    animation-delay: 3500ms;
  }
  .logo {
    opacity: 0;
    animation: enter 500ms ease 1 forwards;
  }

  h1 {
    opacity: 0;
    animation: enter 600ms ease 1 forwards;
    animation-delay: 200ms;
  }
  h2 {
    opacity: 0;
    animation: enter 600ms ease 1 forwards;
    animation-delay: 400ms;
  }
  p {
    opacity: 0;
    animation: enter 600ms ease 1 forwards;
    animation-delay: 600ms;
  }
  .btn {
    opacity: 0;
    animation: enter 600ms ease 1 forwards;
    animation-delay: 2000ms;
  }
</style>
