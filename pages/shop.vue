<template>
  <div class="index">
    <div class="banner">
      <span class="marquee">Good monkeyz minting 2022   +   Good monkeyz minting 2022 + Good monkeyz minting 2022 + Good monkeyz minting 2022 + Good monkeyz minting 2022 +</span>
    </div>

    <div class="social">
      <img class="twitter" :src="twitter" >
      <img class="twitter" :src="twitter" >
      <img class="twitter" :src="twitter" >
    </div>

    <!-- <span v-if="web3Account" class="user">
      Sam
    </span>
    <span v-else class="wallet" @click="connectWallet">
        <img :src="walletText" >
    </span> -->
    <img class="bg-overlay" :src="bgOverlay" >
    
    <div class="info">
      <div class="minted">
        0 / 10,000 Minted
      </div>
    </div>
    <div class="banner banner--bottom">
      <span class="marquee">Good monkeyz minting 2022   +   Good monkeyz minting 2022 + Good monkeyz minting 2022 + Good monkeyz minting 2022 + Good monkeyz minting 2022 +</span>
    </div>
 
    <article>
      <div class="shop">
        <div class="nft">
          <video autoplay loop muted :src="monkey" type="video/mp4"></video>
          <span class="mint" @click="mintNft">Mint</span>
        </div>
        <div class="nft">
          <video autoplay loop muted :src="monkey" type="video/mp4"></video>
          <span class="mint">Mint</span>
        </div>
              <div class="nft">
          <video autoplay loop muted :src="monkey" type="video/mp4"></video>
          <span class="mint">Mint</span>
        </div>
              <div class="nft">
          <video autoplay loop muted :src="monkey" type="video/mp4"></video>
          <span class="mint">Mint</span>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import { ethers } from 'ethers';
// import Menu from '@/components/Menu.vue';

import nftShop from '@/utils/nftShop.json';


import bgOverlay from "@/assets/img/gm-clean.svg"

import twitter from "@/assets/img/twitter.svg"
import walletText from "@/assets/img/wallet.svg"
import monkey from "@/assets/video/mm.mp4"



export default {
  name: 'Shop',
  components: {
    // Menu,
  },
  data: () => {
    return {
      bgOverlay,
      twitter,
      web3Account: '',
      walletText,
      monkey,
    }
  },
  created() {
    this.checkForWallet();

  },
  methods: {
    async checkForWallet() {
      const { ethereum } = window;
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length !== 0) {
        this.web3Account = accounts[0];
      }

      ethereum.on('accountsChanged', (accounts) => {
        console.log('account changed')
      });
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
        this.web3Account = accounts[0];
        console.log("Found an authorized account:", this.web3Account);
      }
    },
    async mintNft() {
      console.log('mint')
        try {
          const { ethereum } = window;

          const CONTRACT_ADDRESS = "0x3414b08f71c05d67fc2a458881f5776d05898ec2";

          if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, nftShop.abi, signer);

            console.log("Going to pop wallet now to pay gas...")

            const overrides = { value: ethers.utils.parseEther('0.001')};
            const nftTxn = await connectedContract.mint(1,1, overrides )
            
            await nftTxn.wait();
            console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

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

<style >

* {
  box-sizing: border-box;
}

.shop {
  display: flex;
  justify-content: space-between;
}

.nft {
  max-width: 200px;
  border: solid 1px #fff;

}
.nft video {
  padding: 1rem;
  max-width: 100%;
}
.mint {
  width: 100%;
  display: block;
  font-family: Arial;
  font-weight: 700;
  color: #000;
  background: #fff;
  text-align: center;
  cursor: pointer;
}

.info {
  position: absolute;
  bottom: 4rem;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: #fff;
  align-items: flex-end;
}
  .bg-overlay {
      mix-blend-mode: lighten;
      max-width: 100%;
      max-height: 90vh;
      padding-top: 10vh;
      pointer-events: none;
  }

.minted {
  padding-left: 2.5rem;
}
.social {
  padding-right: 1.5rem;
  transform: translateY(1rem);
}

  .twitter {
      width: 3rem;
  }

    .wallet {
        position: absolute;
        top: 5rem;
        right: 3rem;
        background: #fff;
        padding: 1.1rem;
        border-radius: 1rem;
        transform: translate(1rem, -1.25rem);
    }


article {
  min-height: 400px;
  padding: 10rem 0;
}

.banner {
  width: 100%;
  padding: 0.4rem 0;
  color: black;
  background: #fff;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 1.3rem;
  letter-spacing: 1px;
  height: fit-content;
  overflow: hidden;
  white-space: nowrap;

  position: absolute;
  top: 0;
  left: 0;
}
.banner--bottom {
  top: auto;
  bottom: 0;
}

.marquee {
  display: block;
  will-change: transform;
  animation: marquee 32s linear infinite;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

</style>


