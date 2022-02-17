<template>
  <div class="index">
    <MinBanner :account="wallet" />
    <div class="splash">
      <div class="splash-inner" :style="`backgroundImage: url(${bg})`">

        <div class="banner-group">
          <h2>Minting Tokens</h2>
          <div class="banner">
            <span class="marquee">GM Token <img :src="star"> GM Token <img :src="star"> GM Token <img :src="star"> GM Token <img :src="star"> </span>
          </div>
          <p>There are only 77 limited edition GM tokens available for mint. <br> The GM Token will give you access to the limited edition GM merch bundle. <br> There are 7 hidden GM mint passes. Good luck minting!</p>
          <span v-if="!wallet" @click="$nuxt.$emit('connect')" class="btn">
            <span>CONNECT WALLET TO MINT</span>
          </span>
          <nuxt-link v-else to="/mint/merch" class="btn">GMTOKEN MINT</nuxt-link>
        </div>

        <div class="counter">
          <h3>{{amountMinted}} <img :src="divider"> 77</h3>
          <h4>Claimed</h4>
        </div>


        <div class="gm-spinner">
            <img class="gm-in" :src="gmIn">
            <img class="gm-out" :src="gmOut">
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ethers } from 'ethers';

import MinBanner from '@/components/MinBanner.vue';

import { 
  MERCH_DROP_CONTRACT,
  INFURA_PROJECT_ID,
  NETWORK_NAME,
  TOKEN_ID_MERCH_BUNDLE 
} from '@/utils/constants';

import GMSHOPJSON from '@/utils/nftShop.json';
import monkey from "@/assets/video/mm.mp4";
import bg from "@/assets/img/hood.jpg";
import star from "@/assets/img/star.svg";

import gmWhite from "@/assets/img/gm-white.svg";

import gmOut from "@/assets/img/gm-outer.svg";
import gmIn from "@/assets/img/gm-inner.svg";
import divider from "@/assets/img/divider.svg"


export default {
  name: 'Index',
  components: {
    MinBanner,
  },
  data: () => {
    return {
      monkey,
      bg,
      star,
      gmOut,
      gmIn,
      gmWhite,
      divider,
      amountMinted: '~',
    }
  },
  computed: mapState(['wallet']),
  created() {
    this.getAmountMinted();
  },
  methods: {
    async getAmountMinted() {
      try {
        const provider = new ethers.providers.InfuraProvider(NETWORK_NAME, INFURA_PROJECT_ID);
        const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, provider);
        const minted = await connectedContract.getMinted();
        this.amountMinted = ethers.utils.formatUnits(minted[TOKEN_ID_MERCH_BUNDLE], 0)
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style scoped>
main {
  background: #fff;
}


.index {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.splash {
  padding: 1rem;
  min-height: 100vh;
  width: 100%;
  position: relative;
   overflow: hidden;
}

.splash-inner {
  background-size: cover;
  background-position: center center ;
  min-height: 100%;
  width: 100%;
}


.banner-group {
  width: 100%;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  color: #fff;
  text-align: center;
}
.banner-group h2 {
  text-align: center;
  font-size: 0.625rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
}
.banner-group p {
  line-height: 2;
  font-family: Helvetica, sans-serif;
  font-weight: 700;
  margin-bottom: 2rem;
}

.banner {
  width: 100%;
  z-index: 1;
  color: #fff;
  text-transform: uppercase;
  font-weight: 900;
  font-size: 9rem;
  white-space: nowrap;
  pointer-events: none;
}

.marquee {
  display: block;
  will-change: transform;
  line-height: 1;
  animation: marquee 30s linear infinite;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes spin {
  from { transform: rotate(0deg) }
  to { transform: rotate(360deg) }
}

.gm-spinner {
  position: absolute;
  display: inline-block;
  left: -1.5rem;
  bottom: -1.5rem;
  transform: scale(0.9);
}
.gm-out {
    animation: spin 20s linear infinite;
  transform-origin: 50% 50% ;
}

.gm-in {
  position: absolute;
  top: 50%;
  left: 46%;
  transform: translate(-50%, -50%); 
}

.btn {
  padding: 1rem;
  border-radius: 1rem;
  text-transform: uppercase;
  background-color: #fff;
  color: #000;
  position: relative;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.75rem;
  overflow: hidden;
  display: inline-block ;
}
.btn span {
  position: relative;
}
.btn::before {
  content: '';
  position: absolute;
  top: -20px;
  left: -20px;
  width: 400px;
  height: 300px;
  z-index: 0;
  background: linear-gradient(222.44deg, #FC9D79 16.01%, #D91EA4 26.09%, #A31FC5 34.3%, #7651C4 44.37%, #2CDAB0 72.36%, #FFF6B4 87.66%);
  animation: go 3.8s infinite alternate;
  opacity: 0.9;
  filter: blur(24px);
}


@keyframes go {
  0% {
    transform: translate(-300px, 100px);
  }
  20% {
    transform: translate(-300px, 100px);
  }
  50% {
    transform: translate(-300px, 100px);
  }
  90% {
    transform: translate(0px, -300px);
  }
  100% {
    transform: translate(0px, -300px);
  }
}

  .counter {
    position: absolute;
    bottom: 2rem;
    right: 3rem;
    color: #fff;
  }
  .counter h3 {
    font-size: 2.6rem;
    margin: 0;
    
  }
  .counter h3 img {
    height: 3.3rem;
    transform: translateY(0.8rem);
  }
    .counter h4 {
      text-align: center;
      font-size: 0.625rem;
     letter-spacing: 0.4em;
     text-transform: uppercase;
  }

</style>


