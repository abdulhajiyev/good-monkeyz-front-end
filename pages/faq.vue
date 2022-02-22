<template>
  <div class="wen">
    <MinBanner :account="wallet" />
    <div class="splash">
      <div class="splash-inner" >
          
        <h1>FAQ</h1>
        
        <ul >
            <li v-for="item in qa" :key="item.q">
                <span class="q">{{item.q}}</span>
                <span class="a">{{item.a}}</span>
            </li>
        </ul>

        <div class="gm-spinner"> 
            <img class="gm-in" :src="gmIn">
            <img class="gm-out" :src="gmOut">
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import MinBanner from '@/components/MinBanner.vue';

import gmOut from "@/assets/img/gm-outer.svg";
import gmIn from "@/assets/img/gm-inner.svg";


export default {
  name: 'Wen',
  components: {
    MinBanner,
  },
  data: () => {
    return {
      gmOut,
      gmIn,
      qa: [
        {
          q: 'Mint Price?',
          a: '0.06 ETH - Public Mint, 0.04 ETH Early Mint, 0.08 Mint Pass',
        },
        {
          q: 'Mint Date',
          a: 'TBD - likely Early April',
        },
        {
          q: 'Wen Merch? How merch?',
          a: 'Buy a token during the limted edition mint - or on the secondary market.',
        },
        {
          q: 'Whats in the Merch Bundle',
          a: '1 Hoodie, 1 cap or Beanie, Sticker Pack, 1 Mint Pass NFT',
        },
        {
          q: 'What is the mint pass',
          a: 'Mint passes can be exchanged for 1 Monkey (on release) for 0ETH cost - will still require gas',
        },
      ],
    }
  },
  computed: mapState(['wallet']),
  created() {
  },
  methods: {
  }
}
</script>

<style scoped>
.wen {
    background: #ccc;
    margin: 1rem;
}


.index {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

h1 {
    color: #fff;
    text-transform: uppercase;
    text-align: center;
    margin-top: 6rem ;
    font-size: 5rem;
}



ul {
    max-width: 50%;
    margin: 0 auto;
}
li {
    color: #fff;
    font-size: 1rem;
}
li .q {
    font-weight: 700;
    display: block;
}

li .a {
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 400;
    margin-bottom: 1rem ;
    display: block;
}

.splash {
  padding: 1rem;
  min-height: 100vh;
  width: 100%;

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
  left: 50%;
  transform: translate(-50%, -50%); 
}

@keyframes spin {
  from { transform: rotate(0deg) }
  to { transform: rotate(360deg) }
}
</style>


