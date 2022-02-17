<template>
  <div class="shop">
    <Menu :account="wallet" @connect="modalActive = true" />
    <WalletModal
      :active="modalActive"
      @close-modal="modalActive = false"
      @connect="connectWallet"
    />
    <div class="splash">
      <div class="splash-inner" :style="`backgroundImage: url(${bg})`">
        <div class="banner">
          <span class="marquee">Sale Starting <img :src="star"> Sale Starting <img :src="star"> Sale Starting <img :src="star"> Sale Starting <img :src="star"> </span>
        </div>
        <nuxt-link to="/mint/merch" class="btn">Merch Pre-Sale</nuxt-link>
        <div class="gm-spinner">
            <img class="gm-in" :src="gmIn">
            <img class="gm-out" :src="gmOut">
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { ethers } from 'ethers';

import WalletModal from '@/components/WalletModal.vue';
import Menu from '@/components/Menu.vue';


import nftShop from '@/utils/nftShop.json';
import monkey from "@/assets/video/mm.mp4";
import bg from "@/assets/img/hood.jpg";
import star from "@/assets/img/star.svg";

import gmOut from "@/assets/img/gm-outer.svg";
import gmIn from "@/assets/img/gm-inner.svg";



export default {
  name: 'Shop',
  components: {
    Menu,
    WalletModal,
  },
  data: () => {
    return {
      monkey,
      bg,
      star,
      gmOut,
      gmIn,
      modalActive: false,
    }
  },
  computed: mapState(['wallet']),
  created() {
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

<style scoped>
main {
  background: #fff;
}


.shop {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.splash {
  padding: 1rem;
  min-height: 100vh;
  width: 100%;
  position: relative;
   overflow: hidden;
}

.splash-inner {
  background-size: cover;
  background-position: center center ;
  min-height: 100%;
  width: 100%;
}



.banner {
  width: 100%;
  z-index: 1;
  color: #fff;
  text-transform: uppercase;
  font-weight: 900;
  font-size: 9rem;
  white-space: nowrap;
  position: absolute;
  top: 50%;
  left: 0;
  pointer-events: none;
}

.marquee {
  display: block;
  will-change: transform;
  animation: marquee 30s linear infinite;
}

@keyframes marquee {
  from { transform: translate(0, -50%); }
  to { transform: translate(-50%, -50%); }
}

@keyframes spin {
  from { transform: rotate(0deg) }
  to { transform: rotate(360deg) }
}

.gm-spinner {
  position: absolute;
  display: inline-block;
  left: -1.5rem;
  bottom: -1.5rem;
  transform: scale(0.9);
}
.gm-out {
    animation: spin 20s linear infinite;
  transform-origin: 50% 50% ;
}

.gm-in {
  position: absolute;
  top: 50%;
  left: 46%;
  transform: translate(-50%, -50%); 
}

.btn {
  padding: 1rem;
  border-radius: 1rem;
  text-transform: uppercase;
  background-color: #fff;
  color: #000;
  position: absolute;
  left: 50%;
  bottom: 30%;
  transform: translate(-50%, 0);
  cursor: pointer;
  text-decoration: none;
  font-size: 0.75rem;
}

</style>


