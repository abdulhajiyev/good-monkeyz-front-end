<template>
  <div class="index">
    <video class="video-bg" width="55%" autoplay muted loop playsinline :src="monkey"></video> 
    <div class="fade-bg"></div>
      <div class="nav">  
      <MinBanner :account="wallet" :active="true"/>
    </div>    
    <div class="minting">
        <span class="zerozero" ref="zerozero">00</span>
        <div v-if="!ready || !wallet ">
          <h1>Minting in Progress</h1>
          <span class="note">Ξ0.033 For Each Mint</span>
          <h3 class="remain">
             <span class="num">{{amountMinted}} <img :src="divider"> 2,222</span>
           </h3>
          <SparkleBtn class="continue" v-if="!wallet" @hit="connectWallet()" text="Connect WALLET to Mint"/>
          <SparkleBtn class="continue" v-else-if="wallet && !ready" @hit="setReady()" text="Continue to Mint"/>
        </div>
        <div v-else>
          <Mint />
        </div>
    </div>
    <MintPass v-if="mintPassReady && !mintPassHidden" @hide="mintPassHidden = true" class="mint-pass" />
    <BoosterPack v-if="boosterReady && !boosterHidden" @hide="boosterHidden = true" class="mint-pass" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { ethers } from 'ethers';

import Mint from '@/components/Mint.vue';
import MintPass from '@/components/MintPass.vue';
import BoosterPack from '@/components/BoosterPack.vue';
import MinBanner from '@/components/MinBanner.vue';

import monkey from "@/assets/video/mm-med.mp4";
import divider from "@/assets/img/divider.svg";
import twitter from "@/assets/img/twitter-black.svg"

import { 
    // INFURA_PROJECT_ID,
    ALCHEMY_API,
    NETWORK_NAME,
    MONKEY_CONTRACT,
    MERCH_DROP_CONTRACT,
    TOKEN_ID_MINT_PASS,
    TOKEN_ID_BOOSTER_PACK,
} from '@/utils/constants';

import GMSHOPJSON from '@/utils/nftShop.json';
import GMPFP from '@/utils/GoodMonkeyz.json';

export default {
  transition: 'index',
  name: 'Index',
  components: {
    Mint,
    MinBanner,
    MintPass,
    BoosterPack,
  },
  data: () => {
    return {
      open: false,
      openPublic: false,
      monkey,
      divider,
      twitter,
      amountMinted: '~',
      zeroWidth: '',
      countdown: '',
      mintPassReady: false,
      mintPassHidden: false,
      boosterHidden: false,
      boosterReady: false,
      ready: false,
    }
  },
  computed: mapState(['wallet']),
  created() {
    const provider = new ethers.providers.AlchemyProvider(NETWORK_NAME, ALCHEMY_API);
    const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, provider);

    this.getcontractData() 
    if(this.wallet) {
      this.getLTDBalances()

      setTimeout(() => {
          this.$nuxt.$emit('invite')
      }, 2000)

    }
    this.$nuxt.$on('web3-active', () => {
      this.getcontractData()
      this.getLTDBalances()

       setTimeout(() => {
          this.$nuxt.$emit('invite')
      }, 2000)

    })

    this.countdownF();
    
    setInterval(()=> {
      this.countdownF();
      
    }, 1000)

    monkeyContract.on("BoostStatus", () => {
      this.getLTDBalances();
    });
    monkeyContract.on("AllowStatus", async () => {
      this.open = await monkeyContract.ALLOW();
    });

    monkeyContract.on("GMMinted", (tokenId) => {
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
      this.$nuxt.$on('web3-active', () => {
        this.ready = true;
      });
    },
    async getcontractData() {
      const provider = new ethers.providers.AlchemyProvider(NETWORK_NAME, ALCHEMY_API);
      const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, provider);
      const currentSupply = parseInt(ethers.utils.formatUnits(await monkeyContract.totalSupply(), 0));
      // const total = 9000 + parseInt( ethers.utils.formatUnits(await monkeyContract.mintPassUsed(), 0))
      this.amountMinted = Number( currentSupply ).toLocaleString() 
      this.open = await monkeyContract.ALLOW();
      this.openPublic = await monkeyContract.PUBLIC();
    },
    async getLTDBalances() {
      const provider = new ethers.providers.AlchemyProvider(NETWORK_NAME, ALCHEMY_API);
      const merchContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, provider);
      const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, provider);
      const balBig = await merchContract.balanceOfBatch([this.wallet, this.wallet], [TOKEN_ID_MINT_PASS, TOKEN_ID_BOOSTER_PACK]);
      const bal = balBig.map( bal => ethers.utils.formatUnits(bal, 0))
      if (bal[0] > 0) {
        this.mintPassReady = await monkeyContract.MINTPASS();
      }
      if (bal[1] > 0) {
        this.boosterReady = await monkeyContract.BOOSTER();
      }
    },
    setReady() {
      this.ready = true;
    },
    resetError() {
      this.failMessage = ''
      this.status = ''
    },
    countdownF() {
      const countDownDate = new Date( Date.UTC(2022, 3, 22, 16, 0, 0, 0)).getTime();
      const now = new Date().getTime();
      const distance = countDownDate - now;

      // const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / (1000) );

      if(seconds.toString().length === 1) {
        seconds = `0${seconds}`
      }

      this.countdown = `${hours}H ${minutes}M <span class="seconds" style="min-width: ${this.zeroWidth}px; " ">${seconds}</span>S`;
    },
  }
}
</script>

<style scoped lang="scss">

$s: 660px;
$m: 960px;
$l: 1720px;

.connect {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}
.remain{
  display: flex;
  flex-direction: column;
}
.note {
  font-size: 0.55rem;
  text-transform: uppercase;
  align-self: center;
  letter-spacing: 0.1rem;

  @media (min-width: $s) {
    font-size: 0.65rem;
    letter-spacing: 0.15rem;
  }

  @media (min-width: $m) {
    font-size: 0.75rem;
    letter-spacing: 0.2rem;
  }

      //
    opacity: 0;
    animation: enter-up-scale 1s 650ms 1 forwards ease ;
}




.index-enter-active, .index-leave-active { 
  transition: opacity 0.7s, transform .5s; 
}
.index-enter, .index-leave-active { 
  opacity: 0;
}

  .nav {
    padding: 1.5rem;
    position: absolute;
    top: 1rem;
    left: 1rem;
    width: calc(100% - 2rem);
    z-index: 1000;

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
  backdrop-filter: blur(4px);
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
    width: 60%;
    transform: translate(-30%, 20%);
  }
  /* // */
  opacity: 0;
  animation: enter-fade 7s ease 1 forwards;
}

.fade-bg {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(270deg, rgba(0, 0, 0, 0.98) 46.4%, rgba(0, 0, 0, 0.52) 100%);
  z-index: 0;
  @media (min-width: $m) {
    background: linear-gradient(240deg, #0a0606 56.4%, rgba(0, 0, 0, 0.52) 100%);
  }
}

.minting {
  width: 90%;
  text-align: center;
  color: #fff;
  position: relative;

  h1 {
    font-size: 1.3rem;
    text-transform: uppercase;
    letter-spacing: 0.25rem;
    margin: 0 0 1rem;
    
    //
    opacity: 0;
    animation: enter-up-scale 1s 350ms 1 forwards ease ;
  }

  h3 {
    font-size: 2.5rem;
    margin: 0 0 1rem;

    //
    opacity: 0;
    animation: enter-up-scale 1s 650ms 1 forwards ease ;
  }

  .continue {
    //
    opacity: 0;
    animation: enter-up-scale 1s 850ms 1 forwards ease ;
  }

  h4 {
    font-size: 0.6rem;
    margin: 1rem 0;
    letter-spacing: 0.25rem;
    
    //
    opacity: 0;
    animation: enter-up-scale 1s 1150ms 1 forwards ease ;
  }
   .raffle {
    //
    opacity: 0;
    animation: enter-up-scale 1s 1150ms 1 forwards ease ;
  }
  img {
    height: 2.5rem;
    transform: translateY(10px);
    
  }

  @media (min-width: $s) {
    h1 {
      font-size: 1.7rem;
      text-transform: uppercase;
      letter-spacing: 0.25rem;
      margin: 0 0 1rem;
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
      font-size: 1.7rem;
      text-transform: uppercase;
      letter-spacing: 0.25rem;
      margin: 0 0 rem;
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


