<template>
  <div class="pre-merch">
    <video class="video-bg" autoplay muted loop :src="monkey"></video>
    <div class="fade-bg"></div>

    <MinBanner
      :account="wallet"
      @connect="modalActive = true" 
    />
    <div v-if="!minted" class="mint" >
        <h2 >Current Price Ξ {{bundlePrice}}</h2>
        <h3 >{{amountMinted}} <img :src="divider"> 77</h3>
        <h4 v-if="amountMinted < 77 || amountMinted == '~' ">Minted</h4>
        <h4 v-else>Sold Out</h4>
        <span v-if="amountMinted < 77 && !txHash" class="btn" @click="mintNft(merchBundleId)">Mint Merch Token</span>
        <span v-if="txHash && !minted" class="btn">
          <span class="loader"></span>
          pending
        </span>
    </div>
    <div v-else class="congrats">
      <h1>CONGRATULATIONS!</h1>
      <h2>#{{parseInt(amountMinted)}} GM TOKEN MINTED</h2>
      
      <a :href="shareLink" class="btn "><img :src="twitterBlack">Share On Twitter</a>
      <!-- <span class="OS">
        <a :href="`https://testnets.opensea.io/assets/${merchContract}/${merchBundleId}`">OS</a>
        <a :href="`https://looksrare.org/collections/${merchContract}`">LR</a>
        <a :href="`https://www.gem.xyz/collection/${merchContract}`">GEMZ</a>
      </span> -->
    </div>
    <transition name="fade">
      <div v-show="errorMessage" class="error">
        <span>{{errorMessage}}</span>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ethers } from 'ethers';
import JSConfetti from 'js-confetti'

import { 
  MERCH_DROP_CONTRACT,
  INFURA_PROJECT_ID,
  NETWORK_NAME,
  TOKEN_ID_MERCH_BUNDLE 
} from '@/utils/constants';

import MinBanner from '@/components/MinBanner.vue';

import GMSHOPJSON from '@/utils/nftShop.json';
import SIGNATURES from '@/utils/signatures.json';
import monkey from "@/assets/video/mm.mp4";

import twitterBlack from "@/assets/img/twitter-black.svg"
import divider from "@/assets/img/divider.svg"


export default {
  transition: 'mint',
  name: 'pre-merch',
  components: {
    MinBanner,
  },
  data: () => {
    return {
      display: false,
      monkey,
      twitterBlack,
      divider,
      amountMinted: '~',
      bundlePrice: '~',
      minted: false,
      txHash: false,
      txPending: false,
      merchBundleId: TOKEN_ID_MERCH_BUNDLE,
      merchContract: MERCH_DROP_CONTRACT,
      shareLink: `https://twitter.com/share?url=https://goodmonkeyz.art&amp;text=${encodeURIComponent('Monkey Madnes')}&amp;hashtags=goodmonkeyz`,
      errorMessage: '',
    }
  },
  computed: mapState(['wallet', 'provider']),
  created() {
    this.getcontractData();

  },
  methods: {
    async getcontractData() {
      const provider = new ethers.providers.InfuraProvider(NETWORK_NAME, INFURA_PROJECT_ID);
      const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, provider);

      const merchBundle = await connectedContract.merch(TOKEN_ID_MERCH_BUNDLE);
      // const supply = ethers.utils.formatUnits(merchBundle.supply, 0);
      this.bundlePrice = ethers.utils.formatEther(merchBundle.price);
      this.amountMinted = ethers.utils.formatUnits(merchBundle.minted, 0);
      

    },
    async mintNft(id) {
      console.log('mint')
        try {
            const provider = this.$provider();
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, signer);
            connectedContract.on("GMMinted", (tokenId) => {
              console.log('NEW MERCH BUNDLE MINTED %s', tokenId) 
              this.getcontractData();
            });
            const signature = SIGNATURES.addresses[this.wallet][0];
            console.log('SIG', signature)
            try {
              const overrides = { value: ethers.utils.parseEther( String( parseFloat(this.bundlePrice) ) )};
              const nftTxn = await connectedContract.mintTokenAllow(0,signature ,overrides)
              nftTxn.wait();
              this.txHash = nftTxn.hash
              const result =  await nftTxn.wait(1);
              
              // console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
              if(result.status === 1) {
                this.minted = true;
                this.fireConfetti();
              } else {
                throw new Error('TX Failed');
              }
            } catch (error) {
              this.errorMessage = error.error.message
              console.log("Error MINTINIG", error);
              setTimeout( ()=> {
                this.errorMessage = '';
              }, 5500)
            }
        } catch (error) {
          console.log(error)
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

<style scoped>
  .mint-enter-active, .mint-leave-active { 
    transition: opacity .7s, transform .7s; 
  }
  .mint-enter, .mint-leave-active { 
    opacity: 0;
    transform: scale(1.2);
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .error {
    padding: 1rem;
    position: absolute;
    bottom: 1rem;
    color: #fff;
    background: linear-gradient(222.44deg, #fc7979 16.01%, #D91EA4 36.09%, #A31FC5 64.3%, #c45151 84.37%);
    max-width: 80%;
    border-radius: 1rem;
    font-size: 0.75rem;
  }

.pre-merch {
  background: #000;
  width: 100%;
  min-height: 100vh;
  max-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.video-bg {
  position: absolute;
  bottom: -5%;
  left: -5%;
  transform: scale(1.4);
  filter: grayscale(100%);
  z-index: 0;
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
.banner {
  position: absolute;
  top: 0;
  width: 100%;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
}
.gm-white {
  max-width: 6rem;
}

.social {
  display: flex;
  justify-content: center;
  align-items: center;
}



  .mint,
  .congrats {
    color: #fff;
    z-index: 1;
    text-align: center;
    text-transform: uppercase;

    align-items: center;
    display: flex;
    flex-direction: column;
  }

  .mint h2 {
    font-size: 1rem;
    letter-spacing: 0.4em;
    /* // */
    opacity: 0;
    animation: enter 2s ease 1 forwards;
    animation-delay: 200ms;
  }
  .mint h3,
  .congrats h1 {
    font-size: 5.4rem;
    margin: 0;
    /* // */
    opacity: 0;
    animation: enter 2s ease 1 forwards;
    animation-delay: 400ms;
  }
  .mint h3 img {
    height: 6rem;
    transform: translateY(1rem);
  }
  .mint h4,
  .congrats h2 {
    font-size: 1rem;
     letter-spacing: 0.4em;
     margin-bottom: 3.5rem;
     /* // */
    opacity: 0;
    animation: enter 2s ease 1 forwards;
    animation-delay: 600ms;
  }
  .mint .btn,
  .congrats .btn {
    background-color: #fff;
    color: black;
    padding: 1rem 1.5rem;
    border-radius: 1rem;
    font-size: 0.7rem;
    cursor: pointer;
        display: flex;
    justify-content: center;
    width: fit-content;
    align-items: center;
    /* // */
    opacity: 0;
    animation: enter 2s ease 1 forwards;
    animation-delay: 800ms;
  }
  .congrats .btn img {
      height: 1.5rem;
      margin-right: 0.5rem;
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



  .loader {

  font-size: 10px;
  margin-right: 0.75rem;
  text-indent: -9999em;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: #ffffff;
  /* background: linear-gradient(to right, #000 10%, rgba(255, 255, 255, 0) 42%); */
  background: linear-gradient(222.44deg, #FC9D79 16.01%, #D91EA4 26.09%, #A31FC5 34.3%, #7651C4 44.37%, #2CDAB0 72.36%, #FFF6B4 87.66%);
  position: relative;
  -webkit-animation: load3 1.4s infinite linear;
  animation: load3 1.4s infinite linear;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
}
.loader:before {
  width: 30%;
  height: 30%;
  background: #ffffff;
  filter: blur(27px); 
  position: absolute;
  top: 0;
  left: 0;
  content: '';
}
.loader:after {
  background: #fff;
  width: 65%;
  height: 65%;
  border-radius: 50%;
  content: '';
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

@keyframes load3 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

</style>


