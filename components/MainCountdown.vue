<template>
  <div class="countdown">
    <img :src="star"> <h1 v-html="countdown">DD HH MM SS</h1> <img :src="star"> 
    <span class="zerozero" ref="zerozero">00</span>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import star from "@/assets/img/star.svg";

export default {
  transition: 'index',
  name: 'Index',
  components: {
  },
  data: () => {
    return {
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
    this.zeroWidth = this.$refs.zerozero ? this.$refs.zerozero.offsetWidth : '100'
    setTimeout( () => {
      this.zeroWidth = this.$refs.zerozero ? this.$refs.zerozero.offsetWidth : '100'
    }, 1000)
  },
  methods: {
    countdownF() {
      const countDownDate = new Date( Date.UTC(2022, 3, 22, 16, 0, 0, 0)).getTime();
      const now = new Date().getTime();
      const distance = countDownDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / (1000) );

      if(seconds.toString().length === 1) {
        seconds = `0${seconds}`
      }
      
      if (days <=0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
        this.countdown = `GOOD MONKEYZ`
      } else {
        this.countdown = `${days}D ${hours}H ${minutes}M <span class="seconds" style="min-width: ${this.zeroWidth}px; " ">${seconds}</span>S`;
      }
    },
  }
}
</script>

<style scoped>
  .c {
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
        font-size: 4.5rem;
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


