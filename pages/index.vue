<template>
  <div class="index">
    <video class="video-bg" width="55%" autoplay muted loop playsinline :src="monkey"></video> 
    <div class="fade-bg"></div>
    <section class="countdown" v-if="!open">
      <Countdown />
    </section>
    <div v-else class="minting">
        <span class="zerozero" ref="zerozero">00</span>
        <div v-if="!wallet">
          <h1>Allow List Minting in Progress</h1>
          <h3>{{amountMinted}} <img :src="divider"> 10,000</h3>
          <SparkleBtn @hit="connectWallet()" text="Connect WALLET to Mint"/>
          <h4>RAFFLE LIST MINTING NEXT IN <span v-html="countdown">DD HH MM SS</span></h4>
        </div>
        <div v-else> 
          <Mint />
        </div>
    </div>
    <MintPass v-if="mintPassReady && !mintPassHidden " @hide="mintPassHidden = true" class="mint-pass" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { ethers } from 'ethers';

import Mint from '@/components/Mint.vue';
import MintPass from '@/components/MintPass.vue';
import Countdown from '@/components/MainCountdown.vue'

import monkey from "@/assets/video/mm-med.mp4";
import divider from "@/assets/img/divider.svg";
import twitter from "@/assets/img/twitter-black.svg"

import { 
    INFURA_PROJECT_ID,
    NETWORK_NAME,
    MONKEY_CONTRACT,
    MERCH_DROP_CONTRACT,
    TOKEN_ID_MINT_PASS,
} from '@/utils/constants';

import GMSHOPJSON from '@/utils/nftShop.json';
import GMPFP from '@/utils/GoodMonkeyz.json';

export default {
  transition: 'index',
  name: 'Index',
  components: {
    Mint,
    MintPass,
    Countdown,
  },
  data: () => {
    return {
      open: false,
      monkey,
      divider,
      twitter,
      amountMinted: '~',
      zeroWidth: '',
      countdown: '',
      mintPassReady: false,
      mintPassHidden: false,
    }
  },
  computed: mapState(['wallet']),
  created() {
    this.getcontractData() 
    this.getMintPassBal()
    this.setStatus();
    if(this.wallet) {
      this.checkByAddress(this.wallet);
    }
    this.$nuxt.$on('web3-active', () => {
      this.checkByAddress(this.wallet);
      this.getcontractData()
      this.getMintPassBal()
    })
    this.countdownF();
    
    setInterval(()=> {
      this.countdownF();
      
    }, 1000)

    const provider = new ethers.providers.InfuraProvider(NETWORK_NAME, INFURA_PROJECT_ID);
    const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, provider);
    monkeyContract.on("GMMinted", (tokenId) => {
      console.log('NEW MERCH BUNDLE MINTED %s', tokenId) 
      this.getcontractData();
    });
  },
  mounted() {
    // if(!this.open){
    //   this.zeroWidth = this.$refs.zerozero.offsetWidth;
    //   setTimeout( () => {
    //     this.zeroWidth = this.$refs.zerozero.offsetWidth;
    //   }, 2000)
    // }
  },
  methods: {
    connectWallet(){
      this.$nuxt.$emit('connect')
    },
    async getcontractData() {
      const provider = new ethers.providers.InfuraProvider(NETWORK_NAME, INFURA_PROJECT_ID);
      const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, provider);
      const totalSupply = await monkeyContract.totalSupply();
      this.amountMinted = Number(ethers.utils.formatUnits(totalSupply, 0)).toLocaleString() 
      this.open = await monkeyContract.ALLOW();
    },
    async getMintPassBal() {
      const provider = new ethers.providers.InfuraProvider(NETWORK_NAME, INFURA_PROJECT_ID);
      const merchContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, provider);
      const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, provider);
      const balBig = await merchContract.balanceOf(this.wallet, TOKEN_ID_MINT_PASS);
      const bal = ethers.utils.formatUnits(balBig, 0)
      if (bal > 0) {
        this.mintPassReady = await monkeyContract.MINTPASS();
      }
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
    countdownF() {
      const countDownDate = new Date( Date.UTC(2022, 3, 22, 14, 0, 0, 0)).getTime();
      const now = new Date().getTime();
      const distance = countDownDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / (1000) );

      if(seconds.toString().length === 1) {
        seconds = `0${seconds}`
      }

      this.countdown = `${days}D ${hours}H ${minutes}M <span class="seconds" style="min-width: ${this.zeroWidth}px; " ">${seconds}</span>S`;
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

.index,
.countdown {
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
.countdown {
  background: transparent;
}

.mint-pass {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  backdrop-filter: blur(8px);
  background: rgba(0,0,0,0.6);
  z-index: 100;
  display: flex;
  // opacity: 0;
  will-change: opacity;
  transition: opacity 200ms ease-in;
}

.video-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: grayscale(10%);
  z-index: 0;
  width: 230%;
  @media (min-width: $s) {
    width: 180%;
  }
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
  background: linear-gradient(270deg, #0a0606 19.4%, rgba(0, 0, 0, 0) 100%);
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
    margin: 0 0 2rem;
  }
  h3 {
    font-size: 2.5rem;
    margin: 0 0 1rem;
  }
  h4 {
    font-size: 0.6rem;
    margin: 1rem 0;
    letter-spacing: 0.25rem;
  }
  img {
    height: 2.5rem;
    transform: translateY(10px);
    
  }

  @media (min-width: $s) {
    h1 {
      font-size: 2rem;
      text-transform: uppercase;
      letter-spacing: 0.25rem;
      margin: 0 0 2rem;
    }
    h3 {
      font-size: 4rem;
      margin: 2rem 0;
    }
    h4 {
      font-size: 0.8rem;
      margin: 2rem 0;
    }
    img {
      height: 3.5rem;
    }
  }
    @media (min-width: $s) {
    h1 {
      font-size: 2rem;
      text-transform: uppercase;
      letter-spacing: 0.25rem;
      margin: 0 0 2rem;
    }
    h3 {
      font-size: 6rem;
      margin: 2rem 0;
    }
    h4 {
      font-size: 0.8rem;
      margin: 2rem 0;
    }
    img {
      height: 5.5rem;
    }
  }
}

.countdown  >>> .seconds {
    display: inline-block;
    text-align: right;
    margin-right: 0.15rem;
}

.zerozero {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
}

</style>


