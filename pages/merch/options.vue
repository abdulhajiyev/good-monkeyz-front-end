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
                    <span @click="size = 's'" :class="{'active' : size === 's'}">Small</span>
                    <span @click="size = 'm'" :class="{'active' : size === 'm'}">Medium</span>
                    <span @click="size = 'l'" :class="{'active' : size === 'l'}">Large</span>
                    <span @click="size = 'xl'" :class="{'active' : size === 'xl'}">XLarge</span>
                </div>
                <label>Select your choice</label>
                <div class="select-btns select-btns--2 ">
                    <span @click="choice = 'cap'" :class="{'active' : choice === 'cap'}">Cap</span>
                    <span @click="choice = 'beanie'" :class="{'active' : choice === 'beanie'}">Beanie</span>
                </div>
                <label>Delivery Address</label>
                <div>
                    <input v-model="name" type="text" placeholder="Name">
                    <input v-model="address" type="text" placeholder="Shipping Address">
                    <input v-model="email" type="email" placeholder="Email">
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
  middleware: 'merchOwner',
  components: {
    MinBanner,
  },
  data: () => {
    return {
      monkey,
      size: 'm',
      choice: 'cap',
      name: '',
      address: '',
      email: '',
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
    async insertMerchOrder(message, signedMessage) {
      const response = await fetch('/.netlify/functions/insert-order', {
          method: 'POST',
          cache: 'no-cache',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            message,
            signedMessage
          }) 
      })
      return await response.json();
    },
    async confirmMerchOrder(message, signedMessage, txHash) {
      const response = await fetch('/.netlify/functions/verify-order', {
          method: 'POST', 
          cache: 'no-cache',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            message,
            signedMessage,
            txHash,
          }) 
      });

      return await response.json(); 
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
            const message = `Merch Bundle: 
  Size: ${this.size.toUpperCase()}
  Choice: ${this.choice.toUpperCase()}
  Name: ${this.name}
  Address: ${this.address}
  Email: ${this.email}
Wallet address:
${this.wallet}`
                
            const signedMessage =  await signer.signMessage(message);
            const order = await this.insertMerchOrder(message, signedMessage)
            console.log(order)
            if (!order.success) throw new Error('Order not Initiated')
            const burn = await connectedContract.burnToken(this.wallet, 0);
            const burnTx = await burn.wait();

            if(burnTx.status === 1) {
              
                const verifiedOrder = await this.confirmMerchOrder(message, signedMessage, burnTx.transactionHash)
                console.log(verifiedOrder)
                if (verifiedOrder.success) {
                    const orderNumber = verifiedOrder.orderNumber
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
    padding: 2rem 2rem 0 2rem;
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
.select-btns span.active {
  background: #000;
  color: #fff;
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


