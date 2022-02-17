<template>
  <div class="pre-merch">
    <video class="video-bg" autoplay muted loop :src="monkey"></video>
    <div class="fade-bg"></div>

    <MinBanner
      :account="wallet"
      @connect="modalActive = true" 
    />
    <div v-if="!minted" class="mint" >
      <h2>Current Price Ξ {{price}}</h2>
      <h3>{{amountMinted}} <img :src="divider"> 77</h3>
      <h4>Minted</h4>
      <span class="btn" @click="mintNft(merchBundleId)">Mint Merch Token</span>
    </div>
    <div v-else class="congrats">
      <h1>CONGRATULATIONS!</h1>
      <h2>#77 GM TOKEN MINTED</h2>
      <span class="btn">Share On Twitter</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ethers } from 'ethers';

import { 
  MERCH_DROP_CONTRACT,
  INFURA_PROJECT_ID,
  NETWORK_NAME,
  TOKEN_ID_MERCH_BUNDLE 
} from '@/utils/constants';

import MinBanner from '@/components/MinBanner.vue';

import GMSHOPJSON from '@/utils/nftShop.json';
import monkey from "@/assets/video/mm.mp4";

import twitter from "@/assets/img/twitter.svg"
import discord from "@/assets/img/discord.svg"
import insta from "@/assets/img/insta.svg"
import gmWhite from "@/assets/img/gm-white.svg"
import divider from "@/assets/img/divider.svg"


export default {
  transition: 'mint',
  name: 'pre-merch',
  components: {
    MinBanner,
  },
  data: () => {
    return {
      monkey,
      twitter,
      discord,
      insta,
      gmWhite,
      divider,
      amountMinted: '~',
      price: 0.05,
      minted: false,
      merchBundleId: TOKEN_ID_MERCH_BUNDLE,
    }
  },
  computed: mapState(['wallet']),
  created() {
    this.getAmountMinted();
    // check for wallet
    // check supply
    // check price
    // on minted change count + price

  },
  methods: {
    async getAmountMinted() {
        try {
          const { ethereum } = window;

          if (ethereum) {
            const provider = new ethers.providers.InfuraProvider(NETWORK_NAME, INFURA_PROJECT_ID);
            const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, provider);

            const supply = await connectedContract.getMinted();
            this.amountMinted = ethers.utils.formatUnits(supply[2], 0)

          } else {
            console.log("Ethereum object doesn't exist!");
          }
        } catch (error) {
          console.log(error)
        }
    },
    async mintNft(id) {
      console.log('mint')
        try {
          const { ethereum } = window;

          if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, signer);

            console.log("Going to pop wallet now to pay gas...")

            try {
              const overrides = { value: ethers.utils.parseEther('0.001')};
              const nftTxn = await connectedContract.mint(id, overrides)
              await nftTxn.wait();
              console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
              this.minted = true;
            } catch (error) {
              console.log("Error MINTINIG");
              console.log(error)
            }

          } else {
            console.log("Ethereum object doesn't exist!");
          }
        } catch (error) {
          console.log(error)
        }
     },

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


  .twitter,
  .discord,
  .insta {
      width: 3rem;
      margin: 0 0.25rem;
      /* cursor: pointer; */
  }
  .discord {
    transform: translateY(-0.2rem) ;
    padding: 0.25rem
  }
  .mint,
  .congrats {
    color: #fff;
    z-index: 1;
    text-align: center;
    text-transform: uppercase;
  }
  .mint h2 {
    font-size: 1rem;
    letter-spacing: 0.4em;
  }
  .mint h3,
  .congrats h1 {
    font-size: 5.4rem;
    margin: 0;
  }
  .mint h3 img {
    height: 6rem;
    transform: translateY(1rem);
  }
  .mint h4 {
     letter-spacing: 0.4em;
     margin-bottom: 3.5rem;
  }
  
  .congrats .btn {
    background-color: #fff;
    color: black;
    padding: 1rem 1.5rem;
    border-radius: 1rem;
    font-size: 0.7rem;
    cursor: pointer;
  }

</style>


