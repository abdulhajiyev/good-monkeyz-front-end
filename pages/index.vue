<template>
  <div class="index">
    <video class="video-bg" width="55%" autoplay muted loop playsinline :src="monkey"></video> 
    <div class="fade-bg"></div> 
    <div class="minting">
        <div v-if="!wallet">
          <h1>Allow List Minting in Progress</h1>
          <h3>{{amountMinted}} <img :src="divider"> 10,000</h3>
          <SparkleBtn @hit="connectWallet()" text="Connect WALLET to Mint"/>
          <h4>RAFFLE LIST MINTING NEXT IN 24:43:02</h4>
        </div>
        <div v-else> 
          <Mint />
        </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Mint from '@/components/Mint.vue';

import monkey from "@/assets/video/mm-med.mp4";
import divider from "@/assets/img/divider.svg";
import twitter from "@/assets/img/twitter-black.svg"

export default {
  transition: 'index',
  name: 'Index',
  components: {
    Mint,
  },
  data: () => {
    return {
      monkey,
      divider,
      twitter,
      amountMinted: '10,000',
    }
  },
  computed: mapState(['wallet']),
  created() {
    this.setStatus();
    if(this.wallet) {
      this.checkByAddress(this.wallet);
    }
    this.$nuxt.$on('web3-active', () => {
      this.checkByAddress(this.wallet);
    })
  },
  methods: {
    openfaq(id){
      this.faq[id].active = !this.faq[id].active;
    },
    connectWallet(){
      this.$nuxt.$emit('connect')
    },
    goToAuth(){
      window.location=`/.netlify/functions/auth?address=${this.wallet}`;
    },
    setStatus(userList, screenName){
      const list = userList || this.$route.query.list 
      
      if(list === 'allow'){
        this.status = 'allow';
      } 
      
      if (list === 'raffle') {
        this.status = 'raffle';;
      } 
      
      if (list === 'false') {
        this.status = 'used';
        this.failMessage =  'Twitter Account is already linked to another Address';
      }

      this.screenName = screenName || this.$route.query.screen_name;
    },
    async checkByAddress(address){
      const res = await (await fetch(`/.netlify/functions/check-allow-list?address=${address}`)).json()
      if ( res != null ) {
        this.setStatus(res.list, res.screenName)
        this.raffleId = res.raffleId || null
        console.log(res)
      }
      this.addressCheck = true;
    },
    resetError() {
      this.failMessage = ''
      this.status = ''
    },
  }
}
</script>

<style scoped lang="scss">

$s: 660px;
$m: 960px;
$l: 1720px;


.index-enter-active, .index-leave-active { 
  transition: opacity 0.7s, transform .5s; 
}
.index-enter, .index-leave-active { 
  opacity: 0;
}

.index {
  background: #000;
  overflow: hidden;
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}


.video-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: grayscale(10%);
  z-index: 0;
  width: 190%;
  @media (min-width: $m) {
    top: auto;
    bottom: 0;
    left: 0;
    width: 80%;
    transform: translate(-30%, 20%);
  }
  /* // */
  opacity: 0;
  animation: enter-fade 6s ease 1 forwards;
}

.fade-bg {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(270deg, #0a0606 14.4%, rgba(0, 0, 0, 0) 100%);
  z-index: 0;
  @media (min-width: $m) {
    background: linear-gradient(270deg, #0a0606 44.4%, rgba(0, 0, 0, 0.4) 100%);
  }
}

.minting {
  width: 90%;
  text-align: center;
  color: #fff;
  position: relative;

  h1 {
    font-size: 1.5rem;
    text-transform: uppercase;
    letter-spacing: 0.25rem;
  }
  h3 {
    font-size: 2.5rem;
    margin: 0 0 0.5rem;
  }
  h4 {
    font-size: 0.6rem;
    margin: 0;
    letter-spacing: 0.25rem;
  }
  img {
    height: 2.5rem;
    transform: translateY(10px);
  }

  @media (min-width: $s) {
    h3 {
      font-size: 3.5rem;
    }
    h4 {
      font-size: 0.7rem;
    }
    img {
      height: 3.5rem;
    }
  }
}


</style>


