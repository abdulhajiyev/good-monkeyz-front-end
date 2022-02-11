<template>
  <div class="index">
    <div class="banner">
      <span class="marquee">Good monkeyz minting 2022   +   Good monkeyz minting 2022 + Good monkeyz minting 2022 + Good monkeyz minting 2022 + Good monkeyz minting 2022 +  Good monkeyz minting 2022   + Good monkeyz minting 2022   + Good monkeyz minting 2022   + Good monkeyz minting 2022   + Good monkeyz minting 2022   + </span>
    </div>

    <nav class="nav">
      <a href="https://docs.google.com/spreadsheets/d/1UWjzL-hIX4_iLB7Stn8Cgv-AmFd_yCrE4qqSkg3nhwo/edit#gid=0" target="_blank"> VIEW EARLY ACCESS LIST
        <img :src="external">
      </a>
    </nav>
    
    <div class="social">
      <a href="https://twitter.com/GoodMonkeyz"><img class="twitter" :src="twitter" ></a>
      <a href="https://www.instagram.com/goodmonkeyz/"><img class="insta" :src="insta" ></a>
      <a href="https://discord.gg/Q6eu62S5sP"><img class="discord" :src="discord"></a>
    </div>

    <img class="bg-overlay" :src="bgOverlay" >
    
    <div class="info">
       <div class="minted-title">
        Minted
      </div>
      <div class="minted-number">
        0 / 10,000
      </div>
    </div>
    <div class="banner banner--bottom">
      <span class="marquee">Good monkeyz minting 2022   +   Good monkeyz minting 2022 + Good monkeyz minting 2022 + Good monkeyz minting 2022 + Good monkeyz minting 2022 +  Good monkeyz minting 2022   + Good monkeyz minting 2022   + Good monkeyz minting 2022   + Good monkeyz minting 2022   + Good monkeyz minting 2022   + </span>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers';
// import Menu from '@/components/Menu.vue';

import nftShop from '@/utils/nftShop.json';


import bgOverlay from "@/assets/img/gm-clean.svg"

import twitter from "@/assets/img/twitter.svg"
import discord from "@/assets/img/discord.svg"
import insta from "@/assets/img/insta.svg"
import walletText from "@/assets/img/wallet.svg"
import external from "@/assets/img/external.png"
import monkey from "@/assets/video/mm.mp4"



export default {
  name: 'IndexPage',
  components: {
    // Menu,
  },
  data: () => {
    return {
      bgOverlay,
      twitter,
      discord,
      insta,
      web3Account: '',
      walletText,
      monkey,
      external,
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

main {
  text-align: center;
}
.bg-overlay {
  
    max-width: 80%;
    max-height: 70vh;
    padding-top: 22vh;
    pointer-events: none;
}

.nav {
    position: absolute;
    display: flex;
    width: 100%;
    justify-content: center;
    top: 4.5rem;
    left: 0;
}
.nav img {
  height: 0.65rem;
}
a {
    font-size: 0.75rem;
    color: #fff;
    text-decoration: none;
}
.info {
  display: flex;
  justify-content: space-between;
  color: #fff;
  flex-flow: column;
  padding: 3rem;
}

.minted-number,
.minted-title {
  text-align: center;
  width: 100%;
}
.minted-title {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 4px;
}
.minted-number {
  font-size: 2.5rem;
}

.social {
  position: absolute;
  top: 5rem;
  right: 2rem;
  left: auto;
  transform: translateY(-1rem);
  display: flex;
  justify-content: center;
  align-items: center;
}
@media(max-width: 600px) { 
  .social {
    bottom: 0rem;
    left: 0;
    right: auto;
    top: auto;
    width: 100%;
  }
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


.banner {
  line-height: 1.5rem;
  height: 2.5rem;
  width: 100%;
  padding: 0.4rem 0;
  z-index: 1;
  color: #fff;
  background: rgba(255,255,255, 0.5);
  text-transform: uppercase;
  font-weight: 700;
  font-size: 1.5rem;
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
@media(max-width: 600px) { 
  .banner--bottom {
    display: none;
  }
}

.marquee {
  display: block;
  will-change: transform;
  animation: marquee 30s linear infinite;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}



</style>


