<template>
  <div class="shop">
    
    <div class="merch">
        <div class="mech-options">
            <div>
              <h2 v-resize-text="{ratio: 0.84}">GOODMONKEYZ</h2>
              <h2 v-resize-text="{ratio: 0.825}"> MERCH BUNDLE</h2>
            </div>
            <p>Burn Merch Token To complete Order</p>
            <p>This process should only be done when in contact with support</p>
            <p>Wallet: {{ wallet }}</p>
            <span class="btn" @click="ordeMerch()">Complete</span>
            {{msg}}
        </div>
    </div>
    <div class="border-bottom"></div>
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

import gmBlack from "@/assets/img/gm-full.svg"

import GMSHOPJSON from '@/utils/nftShop.json';

import { 
  MERCH_DROP_CONTRACT,
  CHAIN_ID
} from '@/utils/constants';

Vue.use(VueResizeText)

export default {
  name: 'complete',
  components: {
  },
  transition: 'scale',
  data: () => {
    return {
      gmBlack,
      msg: '',
      errorMessage: ''
    }
  },
  computed: { 
    ...mapState(['wallet']),
  },
  created() {
    setTimeout( () => {
      if(!this.wallet){
        this.$nuxt.$emit('connect', '/merch/burn')
      }
    },1500)
  },
  methods: {

    async ordeMerch() {

      try {
        const provider = this.$provider();
        const signer = provider.getSigner();
        const { chainId } = await provider.getNetwork()
      
        if (chainId !== CHAIN_ID) throw new Error('WRONG NETWORK - Select ETH MAINNET');

            const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, signer);
            const burn = await connectedContract.burnToken(this.wallet, 0);
            const burnTx = await burn.wait();

            if(burnTx.status === 1) {
              this.msg = "Order Complete"
            } else {
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
  padding-top: 4rem;
  min-height: 95vh;
  flex-direction: column;
  
  @media (min-width: $s) {
    flex-direction: row;
  }
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
  margin: 0 2rem 2rem 2rem;
  min-height: 30vh;
  box-sizing: border-box;
  @media (min-width: $s) {
    margin: 0;
    min-height: 100%;
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
    flex-basis: 32%;
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


