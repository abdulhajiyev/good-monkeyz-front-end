<template>
  <div class="shop">
    <div class="nav"><MinBanner :account="wallet" :active="true" color="black" /></div>
    <div class="heading">
        <h1>ERROR: NGMI!</h1>
        <h2>Ouu we’re sorry! But you need a Good Monkeyz NFT<br> Connect a wallet that holds a Good Monkeyz NFT</h2>
    </div>
    <div class="btns">
      <a href="https://opensea.io/collection/good-monkeyz-limited-editions" class="btn">
      <img :src="openseaLogo">
      <span>View On OpenSea
      </span>
      </a>
      <!-- <span class="btn">Connect Another Wallet</span> -->
    </div>
    <img class="sad-monkey" :src="sadMonkey">
  </div>
</template>

<script>
import { mapState} from 'vuex'

import MinBanner from '@/components/MinBanner.vue';

import sadMonkey from "@/assets/img/sad-monkey.svg";
import openseaLogo from "@/assets/img/opensea.svg"

export default {
  name: 'NGMI',
  components: {
    MinBanner,
  },
  data: () => {
    return {
      openseaLogo,
      sadMonkey,
    }
  },
  computed: mapState(['wallet']),
  created() {
  },
  methods: {
  },

}
</script>

<style scoped>
main {
  background: #fff;
}

    .nav {
      margin: 1.5rem;
      position: relative;
    }

.heading {
    padding: 6rem 0 2rem;
    text-align: center;
}
.heading h1 {
    font-size: 4rem;
    text-transform: uppercase;
    margin: 0;
}
.heading h2 {
    margin: 0;
    font-family: Helvetica, sans-serif;
    font-size: 1.0rem;
    font-weight: 300;
    max-width: 40%;
    margin: 0 auto;
}

    .btns {
      display: flex;  
      /* flex-direction: column; */
      justify-content: center;
      align-items: center;
    }
    .btns .btn {
      margin: 0.5rem;
      background: #000;
      color: #fff;
      padding: 1rem;
      border-radius: 1rem;
      cursor: pointer;
      text-decoration: none;
      display: flex;
      align-items: center;
    }
    .btn span {
      line-height: 2;
      text-transform: uppercase;
      font-size: 0.8rem;
      margin-left: 0.25rem;
    }

    .btn img {
      height: 1.7rem;
    }



.sad-monkey {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 10px);
  max-height: 56vh;
  z-index: -1;
}
</style>


