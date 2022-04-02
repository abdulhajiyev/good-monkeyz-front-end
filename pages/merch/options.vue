<template>
  <div class="shop">
    <MinBanner :account="wallet" :active="true" color="black" />
    
    <div class="merch">
        <div class="mech-options">
            <p>Congratulations! You’ve unlocked the...</p>
            <div>
              <h2 v-resize-text="{ratio: 0.8}">GOODMONKEYZ</h2>
              <h2 v-resize-text="{ratio: 0.817}"> MERCH BUNDLE</h2>
            </div>

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
                <label>Delivery Information</label> 
                <div>
                    <input v-model="name" type="text" placeholder="Name">
                    <input v-model="address" type="text" placeholder="Shipping Address">
                    <input v-model="email" type="email" placeholder="Email">
                </div>
                <button class="btn" :disabled="!formReady" @click="ordeMerch()">Complete</button>
            </div>

        </div>
        <div class="merch-showcase" :style="{ 'background-image': `url(${merchBg})`}">
        </div>
        
    </div>
    <div class="border-bottom"></div>
    <div class="backdrop" :class="{'active': pending }">
      <div class="modal" @click.stop>
        <h2>Order In Progress</h2>
        <div class="in-progress">
          <span class="loader"></span>
          <img :src="gmBlack" class="logo">
        </div>
      </div>
    </div>
    <transition name="fade">
      <div v-show="errorMessage" class="error">
        <span>{{errorMessage}}</span>
      </div>
    </transition>
  </div>
</template>

<script>
import { ethers } from 'ethers';
import { mapState} from 'vuex'

import VueResizeText from 'vue-resize-text';

import Vue from 'vue'

import MinBanner from '@/components/MinBanner.vue';

import gmBlack from "@/assets/img/gm-full.svg"

import GMSHOPJSON from '@/utils/nftShop.json';

import merchBg from '@/assets/img/merch-bg.jpg';

import { 
  MERCH_DROP_CONTRACT,
  INFURA_PROJECT_ID,
  NETWORK_NAME,
  TOKEN_ID_MERCH_BUNDLE 
} from '@/utils/constants';

Vue.use(VueResizeText)

export default {
  transition: 'scale',
  name: 'Redeem',
  middleware: 'merchOwner',
  components: {
    MinBanner,
  },
  data: () => {
    return {
      gmBlack,
      merchBg,
      pending: false,
      size: 'm',
      choice: 'cap',
      name: '',
      address: '',
      email: '',
      errorMessage: '',
    }
  },
  computed: { 
    ...mapState(['wallet']),
    formReady() {
      return this.address !== '' && this.email !== '';
    }
  },
  created() {
    this.$nuxt.$on('web3-active', () => {
      this.ngmiRedirect()
    })
  },
  methods: {
    async ngmiRedirect() {
        try {
            const bal = await this.getBalance()
            if (this.wallet && bal < 1) {
                return this.$router.push('/ngmi');
            }
        } catch(error){
            console.error(error);
            return 0;
        }
    },
    async getBalance() {
      
     try {
          const provider = new ethers.providers.InfuraProvider(NETWORK_NAME, INFURA_PROJECT_ID);
          const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, provider);
          const balBig = await connectedContract.balanceOf(this.wallet, TOKEN_ID_MERCH_BUNDLE);
          return ethers.utils.formatUnits(balBig, 0)
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
            this.pending = true;
            window.scrollTo(0,0);
            const burnTx = await burn.wait();

            if(burnTx.status === 1) {
                const verifiedOrder = await this.confirmMerchOrder(message, signedMessage, burnTx.transactionHash)
                console.log(verifiedOrder)
                if (verifiedOrder.success) {
                    const orderNumber = verifiedOrder.orderNumber
                    this.$router.push(`/merch/order?order=${orderNumber}`)
                } else {
                  this.pending = false;
                  throw new Error('Burn Could not be verfied - Please contact Support');
                }
            } else {
              this.pending = false;
              throw new Error('Burn Transaction Failed');
            }
        } catch(error) {
            if (error.error && error.error.message) {
              this.errorMessage = error.error.message
            } else {
              this.errorMessage =  error
            }
            setTimeout( ()=> {
              this.errorMessage = '';
            }, 5500)
        }
    },
  },
}
</script>

<style scoped lang="scss">
$s: 660px;
$m: 960px;
$l: 1720px;

.scale-enter-active { 
  transition: opacity 0.4s, transform .4s; 
}
.scale-leave-active { 
  transition: opacity 0.5s, transform .5s; 
}
.scale-enter {
  opacity: 0;
  transform: scale(0.95);
}
.scale-leave-active { 
  opacity: 0;
  transform: scale(1);
}

.shop {
  background: #fff;
  border: solid 1rem #fff;
  position: relative;
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
  padding: 2rem 2rem 0 2rem;
  max-width: 100%;
  @media (min-width: $s) {
    flex-basis: 50%;
  }
}
.merch-showcase {
  flex-basis: 50%;
  min-height: 100%;
  background: #ccc;
  background-size: cover;
  background-position: center;
  display: none;
  @media (min-width: $s) {
    display: block;
  }
}

.select-btns {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}
.select-btns span {
    padding: 1rem;
    margin-bottom: 0.5rem;
    border: solid 1px #000;
    font-family: 'Helvetica';
    border-radius: 0.5rem;
    flex-basis: 49.5%;
    text-align: center;
    cursor: pointer;
  @media (min-width: $m) {
    flex-basis: 24%;
  }
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
  font-size: 1rem;
  margin-bottom: 1rem;
  @media (min-width: $s) {
    font-size: 1.5rem;
  }
}

h2 {
  margin: 0;
  line-height: 1;
}
h2:last-of-type {
  margin-bottom: 1rem;
}

label {
    font-family: 'Helvetica';
    color: rgba(0,0,0,0.5);
    margin-bottom: 1rem;
    display: inline-block;
}
input {
    padding: 1rem;
    border: solid 2px #000;
    font-family: 'Helvetica';
    border-radius: 0.5rem;
    display: block;
    width: 100%;
    margin-bottom: 1rem
}
input:placeholder-shown {
  border: solid 2px #999;
}
input:focus{
  background: linear-gradient(#fff, #fff) padding-box, linear-gradient(222.44deg, #FC9D79 16.01%, #D91EA4 26.09%, #A31FC5 34.3%, #7651C4 44.37%, #2CDAB0 72.36%, #FFF6B4 87.66%) border-box;
  outline: none;
  border: solid 2px transparent;
  border-radius: 0.5rem;
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
    position: relative;
    border: none;
    margin-bottom: 2rem;
  @media (min-width: $s) {
    margin-bottom: 0;
  }
}
.btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}


  .error {
    padding: 1rem;
    position: fixed;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    background: linear-gradient(222.44deg, #fc7979 16.01%, #D91EA4 36.09%, #A31FC5 64.3%, #c45151 84.37%);
    max-width: 80%;
    border-radius: 1rem;
    font-size: 0.75rem;
  }



    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        backdrop-filter: blur(8px);
        background: rgba(255,255,255,0.4);
        z-index: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        pointer-events: none;
        will-change: opacity;
        transition: opacity 200ms ease-in;
    }

    .active {
        opacity: 1;
        pointer-events: initial;
    }
    .modal {
      background: #fff;
      padding: 2rem;
      border-radius: 0.7rem;
      box-shadow:  0 0 5px rgba(0,0,0,0.2);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .modal h2{
      text-transform: uppercase;
      font-size: 0.8rem;
      text-align: center;
      margin-bottom: 1rem;
    }

  .in-progress {
    position: relative;
  }
  .in-progress img {
    position: absolute;
    top: 3px;
    left: 2px;
    width: 5.1rem;
  }

  .loader {
    display: block;
    font-size: 10px;
    margin-right: 0.75rem;
    text-indent: -9999em;
    width: 5.3rem;
    height: 5.3rem;
    border-radius: 50%;
    background: linear-gradient(222.44deg, #FC9D79 16.01%, #D91EA4 26.09%, #A31FC5 34.3%, #7651C4 44.37%, #2CDAB0 72.36%, #FFF6B4 87.66%);
    position: relative;
    animation: load 1.4s infinite linear;
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

@keyframes load {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>


