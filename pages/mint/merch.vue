<template>
  <div class="pre-merch">
    <video class="video-bg" autoplay muted loop :src="monkey"></video>
    <div class="fade-bg"></div>

    <MinBanner
      :account="wallet"
      @connect="modalActive = true" 
    />
    <div v-if="minted" class="mint" >
      <h2>Current Price Ξ {{bundlePrice}}</h2>
      <h3>{{amountMinted}} <img :src="divider"> 77</h3>
      <h4 v-if="amountMinted < 77">Minted</h4>
      <h4 v-else>Sold Out</h4>
      <span v-if="amountMinted < 77" class="btn" @click="mintNft(merchBundleId)">Mint Merch Token</span>
    </div>
    <div v-else class="congrats">
      <h1>CONGRATULATIONS!</h1>
      <h2>#{{parseInt(amountMinted)+1}} GM TOKEN MINTED</h2>
      <span class="btn "><img :src="twitterBlack">Share On Twitter</span>
      <span class="OS">
        <a :href="`https://testnets.opensea.io/assets/${merchContract}/${merchBundleId}`">OS</a>
        <a :href="`https://looksrare.org/collections/${merchContract}`">LR</a>
        <a :href="`https://www.gem.xyz/collection/${merchContract}`">GEMZ</a>
      </span>
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
      monkey,
      twitterBlack,
      divider,
      amountMinted: '~',
      bundlePrice: '~',
      minted: false,
      merchBundleId: TOKEN_ID_MERCH_BUNDLE,
      merchContract: MERCH_DROP_CONTRACT,
    }
  },
  computed: mapState(['wallet', 'provider']),
  created() {
    this.minted = false;
    this.getcontractData();
    // check for wallet
    // check supply
    // check price
    // on minted change count + price

  },
  methods: {
    async getcontractData() {
      const provider = new ethers.providers.InfuraProvider(NETWORK_NAME, INFURA_PROJECT_ID);
      const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, provider);

      const supply = await connectedContract.getMinted();
      const price = await connectedContract.getMerchBundlePrice();
      this.amountMinted = ethers.utils.formatUnits(supply[TOKEN_ID_MERCH_BUNDLE], 0);
      this.bundlePrice = ethers.utils.formatEther(price);
    },
    async mintNft(id) {
      console.log('mint')
      
        try {
            const provider = this.$provider();
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, signer);

            console.log("Going to pop wallet now to pay gas...")

            try {
              console.log(  this.bundlePrice)
              const overrides = { value: ethers.utils.parseEther( String( parseFloat(this.bundlePrice) + 0.01 ) )};
              const nftTxn = await connectedContract.mintMerch(overrides)
              nftTxn.wait();
              console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
              this.minted = true;
            } catch (error) {
              console.log("Error MINTINIG");
              console.log(error)
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
  .mint h4,
  .congrats h2 {
    font-size: 1rem;
     letter-spacing: 0.4em;
     margin-bottom: 3.5rem;
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
  }
  .congrats .btn img {
      height: 1.5rem;
      margin-right: 0.5rem;
  }

</style>


