<template>
  <div class="verify">
    <video class="video-bg"  width="55%" autoplay muted loop :src="monkey"></video>
    <div class="fade-bg"></div>

    <MinBanner :account="false" :active="false" />
    <div class="verify-block">
      
      <h1>Wallet Authenticate</h1>

        <div v-if="!wallet" class="step">
          <span v-if="!wallet"  class="btn" @click="connectWallet()">CONNECT WALLET</span>
        </div>
        <div v-else clgass="step">
          <a v-if="!open && verify && screenName" class="verified">✅ {{screenName}} </a>
          <nuxt-link to="/mint/merch?verify=true" v-if="open && verify && screenName" class="verified"> Continue with @{{screenName}} </nuxt-link>
          <a v-if="!verify && !screenName" :href="`/.netlify/functions/auth?address=${wallet}`" class="btn">
            <img class="twitter" :src="twitter" >
            <span >Verify with twitter</span>
          </a>
          <span v-if="verify === 'false'" class="not-verified">{{failMessage}}</span>
        </div>
        <!-- <p>Think you should be on the allow list but it's not working? Experiencing other problems? Contact sammyb on discord.</p> -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import MinBanner from '@/components/MinBanner.vue';

import twitter from "@/assets/img/twitter-black.svg"
import monkey from "@/assets/video/mm-med.mp4";
export default {
  name: 'Verify',
  components: {
    MinBanner,
  },
  data: () => {
    return {
      verify: '',
      twitter,
      screenName: '',
      preCheck: false,
      monkey,
      failMessage: `We can't find your account on the allow List :(`,
      open: true
    }
  },
  computed: mapState(['wallet']),
  created() {
    this.verify = this.$route.query.verify
    this.screenName = this.$route.query.screen_name;
    this.failMessage = this.$route.query.msg === 'used' ? 'Twitter Account is already linked to another Address' : `We can't find your account on the allow List :(`
    
    this.$nuxt.$on('web3-active', () => {
      this.checkByAddress(this.wallet);
    })
    
  },
  methods: {
    connectWallet(){
      this.$nuxt.$emit('connect', '/verify')
    },
    async checkByAddress(address){
      const res = await (await fetch(`/.netlify/functions/check-allow-list?address=${address}`)).json()
      if ( res.data != null ) {
        this.verify = true
        this.screenName = res.data.screen_name || res.data.discord
      }
    }
  }
}
</script>

<style scoped>

  .video-bg {
    position: absolute;
    bottom: 0%;
    left: 50%;
    transform: translate(-50%, 20%);
    filter: grayscale(100%);
    z-index: -1;
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
    z-index: -1;
  }


  .verify {
    padding: 5rem;
    min-height: 100vh;
    overflow: hidden;
    background: #000;
    color: #fff;
    max-height: 100vh;
    position: relative;
    text-align: center;
    justify-content: center;
    align-items: center;
    display: flex;
    
    opacity: 0;
    animation: enter 2s ease 1 forwards;
    animation-delay: 200ms;
  }


    h1 {
      text-transform: uppercase;
     letter-spacing: 0.02rem;
     line-height: 1;
      font-size: 2rem;
    letter-spacing: 0.4em;
    margin-bottom: 3rem;
    }
    @media (max-width: 480px ){
      h1 {
        font-size: 1.4rem;
      }
      
    }
    .connected {
      padding: 1rem;
      background: linear-gradient(222.44deg, #79fcd2 16.01%, #1fc594 34.3%, #7651C4 84.37% );
      border-radius: 1rem;
      display: inline-block;
      line-break: anywhere;
    }
    .verified {
      padding: 1rem;
      background: linear-gradient(222.44deg, #79fcd2 16.01%, #1fc594 34.3%, #7651C4 84.37% );
      border-radius: 1rem;
      display: inline-block;
    }
    .not-verified {
      background: linear-gradient(222.44deg, #fcdd79 16.01%, #c57d1f 34.3%, #c4516a 84.37% );
      padding: 1rem;
      border-radius: 1rem;
      display: inline-block;
    }

    a {
      text-decoration: none;
      color: #fff;
    }
    .btn {
      padding: 1rem;
      border-radius: 1rem;
      background: #fff;
      color: #000;
      text-decoration: none;
      text-transform: uppercase;
      font-size: 0.7rem;
      margin-bottom: 1rem;
      display: inline-flex;
      white-space: nowrap;
      cursor: pointer;

      opacity: 0;
      animation: enter 2s ease 1 forwards;
      animation-delay: 200ms;
    }
    .twitter {
      height: 1rem;
      display: inline-block;
      margin-right: 0.5rem;
    }

    .btn span {
      display: inline-block;
    }
    p {
      font-family: Helvetica, Arial, sans-serif;
    }

    .step {
      margin-bottom: 2rem;
    }


    @keyframes enter {
    0% {
      opacity: 0;
    }
    20% {
      opacity: 0;
      transform: scale(1.2);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>

