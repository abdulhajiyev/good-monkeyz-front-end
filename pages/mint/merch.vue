<template>
  <div class="pre-merch">
    <video class="video-bg" autoplay muted loop :src="monkey"></video>
    <div class="fade-bg"></div>

    <div class="banner">
      <img class="gm-white" :src="gmWhite" >
        <div class="social">
          <a href="https://twitter.com/GoodMonkeyz"><img class="twitter" :src="twitter" ></a>
          <a href="https://www.instagram.com/goodmonkeyz/"><img class="insta" :src="insta" ></a>
          <a href="https://discord.gg/Q6eu62S5sP"><img class="discord" :src="discord"></a>
        </div>
    </div>
    <div class="mint">
      <h2>Current Price Ξ {{price}}</h2>
      <h3>{{minted}} <img :src="divider"> 77</h3>
      <h4>Minted</h4>
      <span class="btn" @click="mintNft(0)">Mint Merch Token</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { ethers } from 'ethers';


import nftShop from '@/utils/nftShop.json';
import monkey from "@/assets/video/mm.mp4";

import twitter from "@/assets/img/twitter.svg"
import discord from "@/assets/img/discord.svg"
import insta from "@/assets/img/insta.svg"
import gmWhite from "@/assets/img/gm-white.svg"
import divider from "@/assets/img/divider.svg"


export default {
  name: 'pre-merch',
  components: {
  },
  data: () => {
    return {
      monkey,
      twitter,
      discord,
      insta,
      gmWhite,
      divider,
      minted: '~',
      price: 0.05,
    }
  },
  computed: mapState(['wallet']),
  created() {
    this.getSupply();
    // check for wallet
    // check supply
    // check price
    // on minted change count + price


    
  },
  methods: {
    ...mapMutations(['setWallet']),
    async checkForWallet() {
      const { ethereum } = window;
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length !== 0) {
        this.setWallet(accounts[0] );
      }
    },

    async connectWallet() {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Make sure you have metamask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      // const chainId = await ethereum.request({ method: 'eth_chainId' });

      if (accounts.length !== 0) {
        this.setWallet(accounts[0] );
        this.modalActive = false;
        console.log("Found an authorized account:", this.wallet);
      }
    },
    async getSupply() {

        try {
          const { ethereum } = window;

          const CONTRACT_ADDRESS = "0x5958C4757564163d97941aC95Bf321232C52193D";

          if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, nftShop.abi, signer);

            console.log("Going to pop wallet now to pay gas...")
            const supply = await connectedContract.getMinted();
            this.minted = ethers.utils.formatUnits(supply[0], 0)

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

          const CONTRACT_ADDRESS = "0x5958C4757564163d97941aC95Bf321232C52193D";

          if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, nftShop.abi, signer);

            console.log("Going to pop wallet now to pay gas...")

            const overrides = { value: ethers.utils.parseEther('0.001')};
            const nftTxn = await connectedContract.mint(id, overrides )
            
            await nftTxn.wait();
            console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
            this.$router.push('/dashboard')

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
  .mint {
    color: #fff;
    z-index: 1;
    text-align: center;
    text-transform: uppercase;
  }
  .mint h2 {
    font-size: 1rem;
    letter-spacing: 0.4em;
  }
  .mint h3 {
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
  .mint .btn {
    background-color: #fff;
    color: black;
    padding: 1rem 1.5rem;
    border-radius: 1rem;
    font-size: 0.7rem;
    cursor: pointer;
  }

</style>


