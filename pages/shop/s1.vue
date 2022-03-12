<template>
  <div class="shop">
    <Menu :account="wallet" @connect="modalActive = true" />
    <div class="grid">
      <div v-for="item in merch" :key="item.title" class="item">
        <span class="supply"> 14/77 </span>
        <video muted autoplay loop :src="item.img"></video>
        <span class="btn" @click="mintNft(item.id)">mint</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { ethers } from 'ethers';

import Menu from '@/components/Menu.vue';


import nftShop from '@/utils/nftShop.json';
import monkey from "@/assets/video/mm.mp4";



export default {
  name: 'Shop-s1',
  components: {
    Menu,
  },
  data: () => {
    return {
      monkey,
      merch: [
        {
          title: 'Hoodie',
          id: 0,
          img: monkey,
        },
        {
          title: 'Hat',
          id: 1,
          img: monkey,
        },
        {
          title: 'Swag',
          id: 2,
          img: monkey,
        },
        {
          title: 'Mint Pass',
          id: 3,
          img: monkey,
        }
      ],
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
    async mintNft(id) {
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
            const nftTxn = await connectedContract.mint(id,1, overrides )
            
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

.grid {
  padding-top: 8rem;
  display: flex;
  justify-content: space-around;
}

.item {
  flex-basis: 22%;
  padding: 1rem;
  border-radius: 2rem;
  box-shadow: 0px 34px 84px rgba(0, 0, 0, 0.09);
  position: relative;
}

.item video{
  max-width: 100%;
  border-radius: 1rem;
  margin-bottom: 1rem;
}

.item .btn {
  background-color: #000;
  color: #fff;
  text-align: center;
  display: block;
  border-radius: 1rem;
  font-size: 0.75rem;
  padding: 0.5rem;
  cursor: pointer;
}
.item .supply {
  position: absolute;
  color: #fff;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 1;
}

</style>


