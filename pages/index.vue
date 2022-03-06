<template>
  <div class="index">
    <MinBanner :account="false" :active="false" />
    <div class="splash">
      <div class="splash-inner" :style="`background-image: url(${bg}), linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5))`">

        <div class="banner-group">
          <span class="btn btn--sparkle">
            <span class="subtitle">GM Bundle Token</span>
            <span class="title">HOODIE + Hat + Mint Pass</span>
          </span>
          <div class="banner">
            <span class="marquee">{{countdown}} <img :src="star"> {{countdown}} <img :src="star"> {{countdown}} <img :src="star"> {{countdown}} <img :src="star"> </span>
          </div>
          <p>There are 77 limited edition GM tokens available. <br> The GM Token gives you access to the limited edition GM merch bundle. <br> Everyone gets a Monkey! Happy Minting</p>
        </div>

        <div class="gm-spinner">
            <img class="gm-in" :src="gmIn">
            <img class="gm-out" :src="gmOut">
        </div>

        <div class="counter">
          <h3> ~ <img :src="divider"> 77</h3>
          <h4>Claimed</h4>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import MinBanner from '@/components/MinBanner.vue';

import monkey from "@/assets/video/mm.mp4";
import bg from "@/assets/img/hood.jpg";
import star from "@/assets/img/star.svg";

import gmWhite from "@/assets/img/gm-white.svg";

import gmOut from "@/assets/img/gm-outer.svg";
import gmIn from "@/assets/img/gm-inner.svg";
import divider from "@/assets/img/divider.svg"


export default {
  transition: 'index',
  name: 'Index',
  components: {
    MinBanner,
  },
  data: () => {
    return {
      monkey,
      bg,
      star,
      gmOut,
      gmIn,
      gmWhite,
      divider,
      amountMinted: '~',
      countdown: '',
    }
  },
  created() {
    this.countdownF();
    
    setInterval(()=> {
      this.countdownF();
      
    }, 1000)
  },
  methods: {
    countdownF() {
      const countDownDate = new Date( Date.UTC(2022, 2, 14, 20, 0, 0, 0)).getTime();
      const now = new Date().getTime();
      const distance = countDownDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / (1000) );

      this.countdown = `${days}D ${hours}H ${minutes}M ${seconds}S`;
      },
  }
}
</script>

<style scoped>

  .index {
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
    background-blend-mode: overlay;
    background-size: cover !important;
    background-position: center center !important;
    min-height: 100%;
    width: 100%;
    text-align: center;
  }

  .banner-group {
    color: #fff;
    text-align: center;
    
  }

  .banner-group h2 {
    text-align: center;
    font-size: 0.625rem;
    letter-spacing: 0.4em;
    
  }

  .banner-group p {
    line-height: 2;
    font-family: Helvetica, sans-serif;
    font-weight: 700;
    margin-bottom: 2rem;
  }

  .banner {
    width: 100%;
    z-index: 1;
    text-transform: uppercase;
    font-weight: 900;
    font-size: 9rem;
    white-space: nowrap;
    pointer-events: none;
  }

@media (max-width: 700px), (max-width: 700px) and (orientation: landscape) {
  .banner-group {
    padding-top: 8rem ;
  }
  .banner {
    font-size: 3.6rem;
    padding: 2rem 0;
  }
  .banner img {
    max-height: 2.4rem;
  }
  .banner-group p {
    font-size: 0.85rem;
    max-width: 90%;
    margin: 0 auto;
    margin-bottom: 0;
  }
}
@media (max-width: 1000px) and (orientation: landscape) {
    .banner-group {
    padding-top: 0 ;
  }
  .banner {
    font-size: 5.6rem;
  }
    .banner img {
    max-height: 4.4rem;
  }
}

@media (min-width: 700px) {

  .banner-group {
    width: 100%;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
}

.marquee {
  display: block;
  will-change: transform;
  line-height: 1;
  animation: marquee 60s linear infinite;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}

@keyframes spin {
  from { transform: rotate(0deg) }
  to { transform: rotate(360deg) }
}

.gm-spinner {
  display: inline-block;
  transform: scale(0.6);
}

@media (min-width: 700px){
  .gm-spinner {
    position: absolute;
    display: inline-block;
    left: -1.5rem;
    bottom: -1.5rem;
    transform: scale(0.9);
  }
  .counter {
        position: absolute;
    bottom: 2rem;
    right: 3rem;
  }
}
@media  (min-width: 700px) and (orientation: landscape) { 
  .gm-spinner {
    transform: scale(0.4) translate(-60%, 60%);
    left:0;
    bottom:0;
  }
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

  .counter {
    color: #fff;
  }

  .counter h3 {
    font-size: 2.6rem;
    margin: 0;
    
  }
  .counter h3 img {
    height: 3.3rem;
    transform: translateY(0.8rem);
  }
  .counter h4 {
      text-align: center;
      font-size: 0.625rem;
     letter-spacing: 0.4em;
     text-transform: uppercase;
  }

</style>

