<template>
  <div class="verify">
    <MinBanner :account="false" :active="false" />
    <div class="verify-block">
      <h1>Merch Bundle - Allow List Verification</h1>

      <!-- <div v-if="!preCheck" class="setup"> -->
        <div class="step">
          <h2>1) Connect Wallet</h2>
          <span v-if="!wallet"  class="btn" @click="connectWallet()">CONNECT WALLET</span>
          <span v-else class="connected">{{wallet}}</span>
        </div>
        <div class="step">
          <h2>2) Verify </h2>
          <span v-if="verify && screenName" class="verified">✅ @{{screenName}} </span>
          <a v-if="!verify && !screenName" :href="`.netlify/functions/auth?address=${wallet}`" class="btn">
            <img class="twitter" :src="twitter" >
            <span >Verify with twitter</span>
          </a>
          <span v-if="verify === 'false'" class="not-verified">We can't find your account on the allow List :(</span>
        </div>

        <p>Think you should be on the allow list but it's not working? Experiencing other problems? Contact sammyb on discord.</p>
      <!-- </div> -->
      <!-- <div v-else class="">
        <h2>Verification Complete </h2>
        <span class="connected">{{wallet}}</span>
      </div> -->

    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import MinBanner from '@/components/MinBanner.vue';

import twitter from "@/assets/img/twitter-black.svg"
export default {
  name: 'Verify',
  components: {
    MinBanner,
  },
  data: () => {
    return {
      verify: '',
      twitter,
      screenName: '',
      preCheck: false,
    }
  },
  computed: mapState(['wallet']),
  created() {
    this.verify = this.$route.query.verify
    this.screenName = this.$route.query.screen_name;

    this.$nuxt.$on('web3-active', async () => {
      const address = this.wallet
      const res = await (await fetch(`.netlify/functions/check-allow-list?address=${address}`)).json()
      this.preCheck = this.wallet === res.data.address
      this.verify = true
      this.screenName = res.data.screen_name
    })
  },
  methods: {
    connectWallet(){
      this.$nuxt.$emit('connect', '/verify')
    }
  }
}
</script>

<style scoped>
    h1 {
      text-transform: uppercase;
     letter-spacing: 0.02rem;
     line-height: 1;
    }
    .connected {
      padding: 1rem;
      background: linear-gradient(222.44deg, #79fcd2 16.01%, #1fc594 34.3%, #7651C4 84.37% );
      border-radius: 1rem;
      display: inline-block;
      line-break: anywhere;
    }
    .verified {
      padding: 1rem;
      background: linear-gradient(222.44deg, #79fcd2 16.01%, #1fc594 34.3%, #7651C4 84.37% );
      border-radius: 1rem;
      display: inline-block;
    }
    .not-verified {
      background: linear-gradient(222.44deg, #fcdd79 16.01%, #c57d1f 34.3%, #c4516a 84.37% );
      padding: 1rem;
      border-radius: 1rem;
      display: inline-block;
    }
    .verify {
        padding: 5rem;
        min-height: 100vh;
        background: black;
        color: #fff;
    }

    .btn {
      padding: 1rem;
      border-radius: 1rem;
      background: #fff;
      color: #000;
      text-decoration: none;
      text-transform: uppercase;
      font-size: 0.7rem;
      margin-bottom: 1rem;
      display: inline-flex;
      white-space: nowrap;
      cursor: pointer;
    }
    .twitter {
      height: 1rem;
      display: inline-block;
      margin-right: 0.5rem;
    }

    .btn span {
      display: inline-block;
    }
    p {
      font-family: Helvetica, Arial, sans-serif;
    }

    .step {
      margin-bottom: 2rem;
    }
</style>

