<template>
  <div class="wen">
    <MinBanner :account="wallet" />
    <div class="splash">
      <div class="splash-inner" >
          
        <h1>Soon™</h1>
        <h2>The Monkeyz release date is not yet fixed. Charlie P is still prepping some Monkeyz for take off.</h2>
        <h2>Stay tuned on Discord &amp; twitter to hear about the plan</h2> 

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


h1 {
    color: #fff;
    text-transform: uppercase;
    text-align: center;
    margin-top: 6rem ;
    font-size: 5rem;
}

h2 {
    text-align: center;
    color: #fff;
    font-size: 1rem;
}

.index {
  width: 100%;
  display: flex;
  justify-content: space-between;
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


