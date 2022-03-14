<template>
  <div class="index">
    <MinBanner :account="wallet" :active="false" />
    <div class="splash">
      <video class="video-bg" width="55%" autoplay muted loop :src="monkey"></video> 
      <div class="fade-bg"></div> 
      <div class="splash-inner" >

        <div class="banner-group">
          <span v-if="!open" class="btn--sparkle">
            <span class="subtitle">GM Bundle Token</span>
            <span class="title">HOODIE + Hat + Mint Pass</span>
          </span>
          <span v-else class="btn--sparkle">
            <span class="subtitle">Mint in Progress</span>
            <span class="title">GM Merch Bundle &amp; + GM Mint Pass</span>
          </span>
          <div class="banner">
            <span v-if="open" class="marquee">START MINTING <img :src="star"> START MINTING <img :src="star"> START MINTING <img :src="star"> START MINTING <img :src="star"> </span>
            <span v-else class="marquee"><span v-html="countdown"></span> <img :src="star"> <span v-html="countdown"></span> <img :src="star"> <span v-html="countdown"></span> <img :src="star"> <span v-html="countdown"></span> <img :src="star"> <span ref="zerozero">44</span></span>
          </div>
          <p>There are 77 limited edition GM tokens available. <br> The GM Token gives you access to the limited edition GM merch bundle. <br> Everyone gets a Monkey! Happy Minting</p>
          <div v-if="open">
            <span v-if="!wallet" @click="$nuxt.$emit('connect')" class="btn">
              <span>CONNECT WALLET TO MINT</span>
            </span>
            <nuxt-link v-else to="/mint/merch" class="btn">
              <span>MINT GM BUNDLE</span>
            </nuxt-link>
          </div>
        </div>

        <!-- <div class="gm-spinner">
            <img class="gm-in" :src="gmIn">
            <img class="gm-out" :src="gmOut">
        </div> -->

        <div class="counter">
          <h3 v-if="open">{{amountMinted}} <img :src="divider"> 77</h3>
          <h3 v-else> ~ <img :src="divider"> 77</h3>
          <h4>Claimed</h4>
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
import monkey from "@/assets/video/mm-med.mp4";
import star from "@/assets/img/star.svg";

import gmWhite from "@/assets/img/gm-white.svg";

import gmOut from "@/assets/img/gm-outer.svg";
import gmIn from "@/assets/img/gm-inner.svg";
import divider from "@/assets/img/divider.svg";


export default {
  transition: 'index',
  name: 'Index',
  components: {
    MinBanner,
  },
  data: () => {
    return {
      monkey,
      star,
      gmOut,
      gmIn,
      gmWhite,
      divider,
      amountMinted: '~',
      open: false,
      countdown: '',
    }
  },
  computed: mapState(['wallet']),
  created() {
    this.getAmountMinted();
    this.countdownF();
    
    setInterval(()=> {
      this.countdownF();
      
    }, 1000)
  },
  mounted() {
    if(this.$refs.zerozero){
      this.zeroWidth = this.$refs.zerozero.offsetWidth;
      setTimeout( () => {
        this.zeroWidth = this.$refs.zerozero.offsetWidth;
      }, 2000)
    }
  },
  methods: {
    async getAmountMinted() {
      try {
        const provider = new ethers.providers.InfuraProvider(NETWORK_NAME, INFURA_PROJECT_ID);
        const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, provider);
        const merchBundle = await connectedContract.merch(TOKEN_ID_MERCH_BUNDLE);
        this.amountMinted = ethers.utils.formatUnits(merchBundle.minted, 0)
        // this.open = merchBundle.allowMintable;
      } catch (error) {
        console.log(error)
      }
    },
    countdownF() {
      const countDownDate = new Date( Date.UTC(2022, 2, 14, 20, 0, 0, 0)).getTime();
      const now = new Date().getTime();
      const distance = countDownDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / (1000) );

      if(seconds.toString().length === 1) {
        seconds = `0${seconds}`
      }

      this.countdown = `${days}D ${hours}H ${minutes}M <span class="seconds" style="width: ${this.zeroWidth}px; " ">${seconds}</span>S`;
      },
  }
}
</script>

<style scoped>
  .index {
    background: #000;
  }

  .video-bg {
    position: absolute;
    bottom: 50%;
    left: 50%;
    transform: translate(-90%, 50%);
    filter: grayscale(100%);
    z-index: 0;
    width: 100%;
  }
  @media (min-width: 700px){
    .video-bg {
      transform: scale(1.4);
      bottom: -10%;
      left: -10%;
      width: 55%;
    }
  }
  .fade-bg {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(270deg, #000000 47.4%, rgba(0, 0, 0, 0) 100%);
    z-index: 0;
  }

  .index {
    width: 100%;
    display: flex;
    justify-content: space-between;
    min-height: 100vh;
    overflow: hidden;
  }

  .splash {
    padding: 1rem;
    border: 1rem #fff solid;
    min-height: 100vh;
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  .splash-inner {
    min-height: 100%;
    width: 100%;
    text-align: center;
  }

  .banner-group {
    color: #fff;
    text-align: center;
    
  }

  .banner-group h2 {
    text-align: center;
    font-size: 0.625rem;
    letter-spacing: 0.4em;
    
  }

  .banner-group p {
    line-height: 2;
    font-family: Helvetica, sans-serif;
    font-weight: 700;
    margin-bottom: 2rem;
    position: relative;
    z-index: 1;
  }

  .banner {
    width: 100%;
    z-index: 1;
    text-transform: uppercase;
    font-weight: 900;
    font-size: 9rem;
    white-space: nowrap;
    pointer-events: none;
  }

@media (max-width: 700px){
  .banner-group {
    padding-top: 8rem ;
  }
  .banner {
    font-size: 3.6rem;
    padding: 2rem 0;
  }
  .banner img {
    max-height: 2.4rem;
  }
  .banner-group p {
    font-size: 0.85rem;
    max-width: 90%;
    margin: 0 auto;
    margin-bottom: 0;
  }
}
@media (min-width: 700px){

  .banner-group {
    width: 100%;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
}

.marquee {
  display: block;
  will-change: transform;
  line-height: 1;
  animation: marquee 60s linear infinite;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}

@keyframes spin {
  from { transform: rotate(0deg) }
  to { transform: rotate(360deg) }
}

.gm-spinner {
  display: inline-block;
  transform: scale(0.6);
}


.gm-out {
  animation: spin 20s linear infinite;
  transform-origin: 50% 50% ;
}

.gm-in {
  position: absolute;
  top: 50%;
  left: 50%;
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
  transform: translateZ(0);
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
    color: #fff;
    position: relative;
    z-index: 1;
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
  .zerozero {
    opacity: 0;
  }
  .marquee >>> .seconds {
    display: inline-block;
    text-align: right;
  }

@media (min-width: 700px){
  .gm-spinner {
    position: absolute;
    display: inline-block;
    left: -1.5rem;
    bottom: -1.5rem;
    transform: scale(0.9);
  }
  .counter {
    position: absolute;
    bottom: 2rem;
    right: 3rem;
  }
}

</style>


