<template>
  <div class="shop">
    <MinBanner :account="wallet" :active="true" color="black" />
    
    <div class="merch">
        <div class="mech-options">
            <p>Congratulations! You’ve unlocked the...</p>
            <h2>GOODMONKEYZ MERCH BUNDLE</h2>

            <div class="merch-options__form">
                <label>Select your size</label>
                <div class="select-btns">
                    <span>Small</span>
                    <span>Medium</span>
                    <span>Large</span>
                    <span>XLarge</span>
                </div>
                <label>Select your choice</label>
                <div class="select-btns select-btns--2 ">
                    <span>Cap</span>
                    <span>Beanie</span>
                </div>
                <label>Delivery Address</label>
                <div>
                    <input type="text" placeholder="Full Name">
                    <input type="text" placeholder="Address">
                    <input type="email" placeholder="Email">
                </div>
                <span class="btn" @click="ordeMerch()">Complete</span>
            </div>

        </div>
        <div class="merch-showcase">
        </div>
    </div>
    <div class="border-bottom"></div>
  </div>
</template>

<script>
import { ethers } from 'ethers';
import { mapState} from 'vuex'

import MinBanner from '@/components/MinBanner.vue';

import monkey from "@/assets/video/mm.mp4";

import GMSHOPJSON from '@/utils/nftShop.json';

import { 
  MERCH_DROP_CONTRACT,
  INFURA_PROJECT_ID,
  NETWORK_NAME,
  TOKEN_ID_MERCH_BUNDLE 
} from '@/utils/constants';

export default {
  transition: 'scale',
  name: 'Redeem',
  components: {
    MinBanner,
  },
  data: () => {
    return {
      monkey,
      balance: '',
    }
  },
  computed: mapState(['wallet']),
  async created() {
    console.log( await this.getBalance() )
  },
  methods: {
    async getBalance() {
      
     try {
          const provider = new ethers.providers.InfuraProvider(NETWORK_NAME, INFURA_PROJECT_ID);
          const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, provider);
          return await connectedContract.balanceOf(this.wallet, TOKEN_ID_MERCH_BUNDLE);
        } catch(error){
            console.error(error);
          return 0;
        }
    },
    async ordeMerch() {

        const provider = this.$provider();
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, signer);
        // connectedContract.on("GmBurned", (tokenId) => {
        //     console.log('NEW MERCH BUNDLE MINTED %s', tokenId) 
        //     // this.getcontractData();
        // });

        try {
            const message = `
                    Message: SAM - UK
                    Wallet address:
                        ${this.wallet}
                `
                
            const signedMessage =  await signer.signMessage(message);
            // send to db one -> 
            const burn = await connectedContract.burnToken(this.wallet, 0);
            const result = await burn.wait();
            const txHash = result.transactionHash;

            if(result.status === 1) {
                console.log('success: ', txHash)
                const data = {
                    message,
                    signedMessage,
                    txHash,
                }
                const response = await fetch('/.netlify/functions/verify-burn', {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data) // body data type must match "Content-Type" header
                });

                const json = await response.json(); // parses JSON response into native JavaScript objects
                console.log(json)
                if (json.success) {
                    const orderNumber = 1
                    this.$router.push(`/merch/order?order=${orderNumber}`)
                } else {
                    throw new Error('TX Failed');
                }
            } else {
                throw new Error('TX Failed');
            }
        } catch(error) {
            console.error(error)
        }
    },
  },
  middleware({ redirect }) {
    const balance = 1
    console.log('BALANCE: %s', balance)
    if (balance < 1) {
      return redirect('/ngmi');
    }
  }

}
</script>

<style scoped>
.scale-enter-active, .scale-leave-active { 
  transition: opacity 0.6s, transform .5s; 
}
.scale-enter, .scale-leave-active { 
  opacity: 0;
  transform: scale(0.95);
}

.shop {
  background: #fff;
  border: solid 1rem #fff;
}
.border-bottom {
    width: 100%;
    position: fixed;
    height: 1rem;
    bottom: 0;
    left: 0;
    z-index: 10;
    background: #fff;
}

.merch {
  display: flex;
  justify-content: center;
  padding-top: 5rem;
    min-height: 95vh;
}

.mech-options {
    flex-basis: 50%;
    padding: 2rem;
}
.merch-showcase {
    flex-basis: 50%;
    min-height: 100%;
    background: #ccc;
}

.select-btns {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
}
.select-btns span {
    padding: 1rem;
    border: solid 1px #000;
    font-family: 'Helvetica';
    border-radius: 0.5rem;
        flex-basis: 24%;
    text-align: center;
    cursor: pointer;
}
.select-btns--2 span{
    flex-basis: 49.33%;
}

p {
    font-family: 'Helvetica';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

h2 {
    font-size: 4.7rem;
line-height: 0.85;
    text-align: justify;
    margin: 0;
}
h2:after {
  content: "";
  display: inline-block;
  width: 100%;
}
label {
    font-family: 'Helvetica';
    color: rgba(0,0,0,0.5);
    margin-bottom: 1rem;
    display: inline-block;
}
input {
    padding: 1rem;
    border: solid 1px #000;
    font-family: 'Helvetica';
    border-radius: 0.5rem;
    display: block;
    width: 100%;
    margin-bottom: 1rem
}
.btn {
    display: block;
    width: 100%;
    padding: 1rem;
    border-radius: 0.5rem;
    color: #fff;
    background: #000;
    text-align: center;
    text-transform: uppercase;
    font-size: 0.75rem;
    cursor: pointer;
}
</style>


