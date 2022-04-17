<template>
  <div class="index">
    <div class="splash">
      <video class="video-bg" width="55%" autoplay muted loop :src="monkey"></video> 
      <div class="fade-bg"></div> 
      <div class="countdown" >
        <img :src="star"> <h1 v-html="countdown">DD HH MM SS</h1> <img :src="star"> 
      </div>
    </div>
    <span class="zerozero" ref="zerozero">00</span>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import VueResizeText from 'vue-resize-text';
import Vue from 'vue'

import monkey from "@/assets/video/mm-med.mp4";
import star from "@/assets/img/star.svg";

Vue.use(VueResizeText)

export default {
  transition: 'index',
  name: 'Index',
  components: {
  },
  data: () => {
    return {
      monkey,
      star,
      countdown: '-- -- -- ---',
      zeroWidth: '',
    }
  },
  computed: mapState(['wallet']),
  created() {
    this.countdownF();
    
    setInterval(()=> {
      this.countdownF();
      
    }, 1000)
  },
  mounted() {
    if(!this.open){
      this.zeroWidth = this.$refs.zerozero.offsetWidth;
      setTimeout( () => {
        this.zeroWidth = this.$refs.zerozero.offsetWidth;
      }, 2000)
    }
  },
  methods: {
    countdownF() {
      const countDownDate = new Date( Date.UTC(2022, 3, 21, 13, 37, 0, 0)).getTime();
      const now = new Date().getTime();
      const distance = countDownDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / (1000) );

      if(seconds.toString().length === 1) {
        seconds = `0${seconds}`
      }

      this.countdown = `${days}D ${hours}H ${minutes}M <span class="seconds" style="min-width: ${this.zeroWidth}px; " ">${seconds}</span>S`;
      },
  }
}
</script>

<style scoped>
  .index {
    background: #000;
  }

  .video-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    filter: grayscale(50%);
    z-index: 0;
    width: 100%;
  }
 
  .fade-bg {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(270deg, #000000 15%, rgba(0, 0, 0, 0) 100%);
    z-index: 0;
  }

  .index {
    width: 100%;
    min-height: 100vh;
    overflow: hidden;
  }

  .splash {
    min-height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
  }

.countdown {
    position: absolute;
    width: 95%;
    margin: 0 auto;
    z-index: 100;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    justify-content: center;
    align-items: center;
    display: flex;
    /*  */
    opacity: 0;
    animation-delay: 2s;
    animation: enter 1s ease 1 forwards;
}
.countdown img {
    height: 2rem;
    margin: 0 0.5rem;
}
@media (min-width: 600px){
    .countdown img {
        height: 3.5rem;
    }
}

@media (min-width: 800px){
    .countdown img {
        height: 4rem;
    }
}

@media (min-width: 1000px){
    .countdown img {
        height: 4.5rem;
    }
}

h1,
.zerozero {
    display: inline-block;
    font-size: 2rem;
}
@media (min-width: 600px){
    h1,
    .zerozero  {
        font-size: 4rem;
    }
}
@media (min-width: 800px){
    h1,
    .zerozero  {
        font-size: 5,5rem;
    }
}
@media (min-width: 1200px){
    h1,
    .zerozero  {
        font-size: 7rem;
    }
}

.countdown  >>> .seconds {
    display: inline-block;
    text-align: right;
    margin-right: 0.15rem;
}

.zerozero {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
}
</style>


