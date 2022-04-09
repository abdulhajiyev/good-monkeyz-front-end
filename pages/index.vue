<template>
  <div class="index">
    <section class="splash">

      <video class="video-bg" width="55%" autoplay muted loop playsinline :src="monkey"></video> 
      <div class="fade-bg"></div> 

      <div class="early">
          <div v-if="!wallet">
            <Mint />
            <h1>Early Access Verify</h1>
            <SparkleBtn @hit="connectWallet()" text="Verify WALLET"/>
          </div>
          <div v-else> 
            <Mint />
          </div>
      </div>
    
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Mint from '@/components/Mint.vue';

import monkey from "@/assets/video/mm-med.mp4";
import divider from "@/assets/img/divider.svg";
import twitter from "@/assets/img/twitter-black.svg"

export default {
  transition: 'index',
  name: 'Index',
  components: {
    Mint,
  },
  data: () => {
    return {
      monkey,
      divider,
      twitter,
    }
  },
  computed: mapState(['wallet']),
  created() {
    this.setStatus();
    this.getCount();
    if(this.wallet) {
      this.checkByAddress(this.wallet);
    }
    this.$nuxt.$on('web3-active', () => {
      this.checkByAddress(this.wallet);
    })
  },
  methods: {
    openfaq(id){
      this.faq[id].active = !this.faq[id].active;
    },
    connectWallet(){
      this.$nuxt.$emit('connect')
    },
    goToAuth(){
      window.location=`/.netlify/functions/auth?address=${this.wallet}`;
    },
    setStatus(userList, screenName){
      const list = userList || this.$route.query.list 
      
      if(list === 'allow'){
        this.status = 'allow';
      } 
      
      if (list === 'raffle') {
        this.status = 'raffle';;
      } 
      
      if (list === 'false') {
        this.status = 'used';
        this.failMessage =  'Twitter Account is already linked to another Address';
      }

      this.screenName = screenName || this.$route.query.screen_name;
    },
    async checkByAddress(address){
      const res = await (await fetch(`/.netlify/functions/check-allow-list?address=${address}`)).json()
      if ( res != null ) {
        this.setStatus(res.list, res.screenName)
        this.raffleId = res.raffleId || null
        console.log(res)
      }
      this.addressCheck = true;
    },
    async getCount(){
      const res = await (await fetch(`/.netlify/functions/allow-list-count`)).json()
      this.count = res.count
    },
    resetError() {
      this.failMessage = ''
      this.status = ''
    },
  }
}
</script>

<style scoped lang="scss">

$s: 660px;
$m: 960px;
$l: 1720px;


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s, transform .35s;
}
.fade-enter,
.fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.index-enter-active, .index-leave-active { 
  transition: opacity 0.7s, transform .5s; 
}
.index-enter, .index-leave-active { 
  opacity: 0;
}
  .index {
    background: #000;
    overflow: hidden;
  }

  .video-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    filter: grayscale(10%);
    z-index: 0;
    width: 190%;
    @media (min-width: $m) {
      top: auto;
      bottom: 0;
      left: 0;
      width: 80%;
      transform: translate(-30%, 20%);
    }
    /* // */
    opacity: 0;
    animation: enter-fade 8s ease 1 forwards;
  }

  .fade-bg {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(270deg, #0a0606 14.4%, rgba(0, 0, 0, 0) 100%);
    z-index: 0;
    @media (min-width: $m) {
      background: linear-gradient(270deg, #0a0606 44.4%, rgba(0, 0, 0, 0.4) 100%);
    }
  }
  .fade--monkey {
    background: linear-gradient(210deg, rgba(0,0,0,0.8) 43.4%, rgba(0, 0, 0, 0) 100%);
    z-index: 1;
  }

  .splash {
    min-height: 100vh;
    width: 100%;
    position: relative;
    overflow: hidden;
    padding-top: 3rem;

  }

    .banner {
      width: 100%;
      z-index: 1;
      text-transform: uppercase;
      font-weight: 900;
      font-size: 3rem;
      white-space: nowrap;
      pointer-events: none;
      position: absolute;
      background: #fff;
      @media (min-width: $s) {
        font-size: 3.3rem;
      }
      @media (min-width: $m) {
        font-size: 3.5rem;
      }
      @media (min-width: $l) {
        font-size: 4rem;
      }
      /* // */
      opacity: 0;
      animation: enter-right 1s ease 1 forwards;
    }
    .banner--top {
      top: 0;
    }
    .banner--bottom {
      bottom: 0;
    }
    .marquee {
      display: block;
      will-change: transform;
      line-height: 1;
      animation: marquee 20s linear infinite;
      @media (min-width: $m) {
        animation: marquee 60s linear infinite;
      }
   
    }
    .marquee img{
      height: 2.4rem;
    }
    .nav {
      margin: 1.5rem;
      position: relative;
    }

    // 
    .early {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -60%);
      color: #fff;
      width: 90%;
      text-align: center;
      opacity: 0;
      animation-delay: 3s;
      animation: enter-fade 1s ease 1 forwards;

      h1 {
        opacity: 0;
        animation-delay: 1s;
        animation: enter 1s ease 1 forwards;
      }
      .verified {
        opacity: 0;
        animation-delay: 1.2s;
        animation: enter 1s ease 1 forwards;
      }
    }
    .minting {
      position: absolute;
      bottom: 6rem;
      width: 100%;
      text-align: center;
      color: #fff;
      
      opacity: 0;
      animation-delay: 3s;
      animation: enter-up 3s ease 1 forwards;

      h3 {
        font-size: 2.5rem;
        margin: 0 0 0.5rem;
      }
      h4 {
        font-size: 0.6rem;
        margin: 0;
        letter-spacing: 0.25rem;
      }
      img {
        height: 2.5rem;
        transform: translateY(10px);
      }

      @media (min-width: $s) {
        h3 {
          font-size: 3.5rem;
        }
        h4 {
          font-size: 0.7rem;
        }
        img {
          height: 3.5rem;
        }
      }
    }


    .verify {
      padding: 5rem;
      min-height: 100vh;
      overflow: hidden;
      background: #000;
      color: #fff;
      max-height: 100vh;
      position: relative;
      text-align: center;
      justify-content: center;
      align-items: center;
      display: flex;
      
      opacity: 0;
      animation: enter 2s ease 1 forwards;
      animation-delay: 200ms;
    }

    .early h2 {
      text-transform: uppercase;
      line-height: 1;
      font-size: 1rem;
      letter-spacing: 0.15em;
    }

    .early h1 {
      text-transform: uppercase;
      letter-spacing: 0.02rem;
      line-height: 1;
      font-size: 1.4rem;
      letter-spacing: 0.4em;
      margin-bottom: 3rem;
      @media (min-width: $s) {
        font-size: 2rem;
      }
    }
    @media (max-width: 480px ){
      h1 {
        font-size: 1.4rem;
      }
      h2 {
        font-size: 0.7rem;
      }
    }
    @media (min-width: $m) {
      h1 {
        white-space: nowrap;
      }
    }

    .verified {
      padding: 1.4rem 2rem;
      border-radius: 4.5rem / 1rem;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      text-transform: uppercase;


    }
    .screen-name {
      display: inline-block;
    }
    .mints {
      display: inline-block;
      font-family: Helvetica, sans-serif;
      font-size: 0.85rem;
      letter-spacing: 0.2rem;
      margin-bottom: 0.5rem;
    }

    a {
      text-decoration: none;
      color: #fff;
    }

    .btn {
      background: #fff;
      color: #000;
      text-decoration: none;
      padding: 1.4rem 2rem;
      border-radius: 4.5rem / 1rem;
      text-transform: uppercase;
      color: #000;
      background: #fff;
      position: relative;
      cursor: pointer;
      text-decoration: none;
      font-size: 0.75rem;
      overflow: hidden;
      display: inline-flex ;
      transform: translateZ(0);

      opacity: 0;
      animation: enter 2s ease 1 forwards;
      animation-delay: 200ms;
    }
    .btn span {
      position: relative;
    }
    .btn::before {
      content: '';
      position: absolute;
      top: -20px;
      left: -20px;
      width: 400px;
      height: 300px;
      z-index: 0;
      background: linear-gradient(222.44deg, #FC9D79 16.01%, #D91EA4 26.09%, #A31FC5 34.3%, #7651C4 44.37%, #2CDAB0 72.36%, #FFF6B4 87.66%);
      animation: go 3.8s infinite alternate;
      opacity: 0.9;
      filter: blur(24px);
    }

    .not-verified {
      cursor: pointer;
    }

    .twitter {
      position: relative;
      height: 1rem;
      display: inline-block;
      margin-right: 0.5rem;
    }

    .btn span {
      display: inline-block;
    }
  

    .step {
      margin-bottom: 2rem;
    }

    //
  .monkeyz {
    padding: 6rem 0;
    position: relative;
    overflow: hidden;
  }
  .lead {
    max-width: 70%;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    padding-bottom: 6rem;
  }
  .lead p{
    color: #fff;
    margin: 0 auto;
    position: absolute;
    font-family: Helvetica, sans-serif;
    font-weight: 400;
    line-height: 2;
    font-size: 1.1rem;
    @media (min-width: $s) {

      font-size: 1.3rem;
    }
    @media (min-width: $m) {
      font-size: 1.4rem;
            margin-left: 50%;
      max-width: 50%;
    }
    @media (min-width: $s) {
      font-size: 1.7rem;
    }
  }

  h2  {
    font-weight: 900;
    color: #fff;
    font-size: 1.5rem;
    @media (min-width: $s) {
      font-size: 2.6rem;
    }
    @media (min-width: $m) {
      font-size: 3.6rem;
    }
    @media (min-width: $l) {
        font-size: 5.5rem;
    }
  }
  .m-scroll {
    display: flex;
    flex-wrap: nowrap;
    padding: 0.75rem 0 ;
    animation: scroll 50s ease-in-out alternate infinite;
  }
  .m-scroll img {
    max-height: 8rem;
    margin-right: 1.5rem;
    display: inline;
  }
  .m-scroll--1,
  .m-scroll--3 {
    animation: scroll 50s ease-in-out alternate-reverse infinite;
  }

    @keyframes scroll {
      from { transform: translateX(0); }
      to { transform: translateX(-100%); }
    }

    @keyframes marquee {
      from { transform: translateX(0); }
      to { transform: translateX(-100%); }
    }


  .faq {
    max-width: 80%;
    margin: 0 auto;
  }


  .faq-list__item {
    padding: 1.5rem 2rem;
    background: #2B2B2B;
    position: relative;
    cursor: pointer;
    margin-bottom: 2rem;
    transition: ease-in-out 300ms;
  }
  .faq-list__item:last-of-type {
    margin-bottom: 0;
  }

  .faq-item__close {
    position: absolute;
    font-size: 2rem;
    color: #fff;
    top: 1.4rem;
    right: 1.2rem;
    font-family: Helvetica, sans-serif;
    cursor: pointer;
    transform: rotate(135deg);
    transition: ease-in-out 300ms;

    @media (min-width: $s) {
      top: 1.6rem;
      right: 1.5rem;
    }
    @media (min-width: $m) {
      right: 1.5rem;
      top: 1.7rem;
      font-size: 2.6rem;
    }

  }
  .faq-item__close.active {
     transform: rotate(90deg);
  }

  .faq-item__question {
    background: #2B2B2B;
    color: #fff;
    font-size: 1.3rem;
    margin: 0;
    padding-right: 1rem;
    @media (min-width: $s) {
      font-size: 1.5rem;
    }
    @media (min-width: $m) {
      font-size: 2rem;
    }
    @media (min-width: $l) {
      font-size: 2.4rem;
    }
  }

  .faq-item__answer {
    font-family: Helvetica, sans-serif;
    line-height: 1.3;
    color: #888;
    @media (min-width: $s) {
      font-size: 1.1rem;
    }
    @media (min-width: $m) {
      font-size: 1.2rem;
    }
    @media (min-width: $l) {
      font-size: 1.5rem;
    }
  }


  .faq-item__answer ::v-deep a {
    color: #fff;
    text-decoration: none;
    border-bottom: solid 1px #fff;
}

  .banner--middle {
    color: #fff;
    padding: 4rem 0;
    background: #000;
    font-size: 3rem;
    position: static;
    @media (min-width: $s) {
      font-size: 4rem;
    }
    @media (min-width: $m) {
      font-size: 6rem;
    }
    @media (min-width: $l) {
      font-size: 8rem;
    }
  } 


  .team {
    max-width: 80%;
    margin: 2rem auto 0;
  }
  .monkey {
    display: flex;
    flex-direction: row;
    margin-bottom: 6rem;
    position: relative;
    max-width: 1180px;
    margin: 0 auto;
  }
  .monkey:last-of-type {
     padding-bottom: 8rem;
  }
  .monkey__avatar {
    max-width: 100%;
    flex-basis: 70%;
    @media (min-width: $s) {
      flex-basis: 50%;
    }
    @media (min-width: $m) {
      flex-basis: 40%;
      max-width: 400px;
    }
  }
  .monkey__avatar img {
    max-width: 90%;
    
  }
  .monkey__info {
    
    position: relative;
    z-index: 1;

    flex-basis: 30%;
    max-width: 50%;
    padding-top: 5%;
    @media (min-width: $s) {
      flex-basis: 50%;
      padding-top: 12%;
    }
    @media (min-width: $m) {
      flex-basis: 60%;
      
      // padding-top: 0;
    }
  }
  .monkey__info--right{
    margin-left: auto;
  }
  
  .monkey__info h3{
    color: #fff;
    
    margin: 0;
    line-height: 1;
    transform: translateX(-25%);
    margin-top: 2rem;
    font-size: 2rem;
    @media (min-width: $s) {
      font-size: 4rem;
    }
    @media (min-width: $m) {
      font-size: 6rem;
    }
  }
  .monkey__info h4 {
    color: rgba(255,255,255,0.6);
    margin: 0;
    line-height: 1;
    margin-left: 1rem;
    font-size: 1.2rem;
    @media (min-width: $s) {
      font-size: 2.2rem;
    }
    @media (min-width: $m) {
      font-size: 2.6rem;
    }
  }
  .monkey__info h5 {
    color: rgba(255,255,255,0.3);
    margin: 0;
    line-height: 1;
    margin-left: 1rem;
    font-size: 1.2rem;
    @media (min-width: $s) {
      font-size: 2.2rem;
    }
    @media (min-width: $m) {
      font-size: 2.6rem;
    }
  }
  .monkey__info--right h3 {
    transform: translateX(25%);
    text-align: right;
  }
  .monkey__info--right h4,
  .monkey__info--right h5 {
    margin-left: 0;
    margin-right: 1rem;
    text-align: right;
  }


  /*  */
  .good-things {
    max-width: 80%;
    margin: 0 auto;
    font-size: 2.1rem;
    line-height: 1;
    color: #fff;
    z-index: 1;
    position: relative;
    text-align: center;
    @media (min-width: $s) {
      font-size: 5rem;
    }
    @media (min-width: $m) {
      font-size: 7rem;
    }
    @media (min-width: $l) {
      font-size: 12rem;
    }
    p {
      margin: 0;
    }
  }

  .spotlight {
    width: 160%;
    position: absolute;
    z-index: 0;
    pointer-events: none;
    @media (min-width: $s) {
      width: 130%;
    }
    @media (min-width: $m) {
      width: 100%;
    }
  }
  .spotlight--hero{
    opacity: 0.15;
    width: 300%;
    top: -10%;
    @media (min-width: $s) {
      width: 130%;
    }
    @media (min-width: $m) {
      width: 100%;
    }
  }

  .spotlight--charles {
    left: -30%;
    opacity: 0.6;
    @media (min-width: 1600px) {
      width: 180%;
      left: -50%;
      top: -100%;
    }
    @media (min-width: 2000px) {
      width: 220%;
      left: -70%;
      top: -150%;
    }
  }

  .spotlight--sam {
    right: -30%;
    top: -50%;
    opacity: 0.6;
    @media (min-width: 1400px) {
      width: 180%;
      right: -50%;
      top: -130%;
    }
    @media (min-width: 2000px) {
      width: 220%;
      right: -70%;
      top: -150%;
    }
  } 
  
  .spotlight--footer {
    bottom: 0;
    left: 0;
  }
 

  @keyframes spin {
  from { display: block; transform: rotate(0deg) translate(-50%, -50%)}
  to { display: block; transform: rotate(360deg) translate(-50%, -50%)}
}

.gm-full {
  position: relative;
  padding-bottom: 5rem;
  @media (min-width: $m) {
      transform: none;
      padding-bottom: 0;
      padding: 2rem 0 5rem;
  }
}
.gm-spinner {
  display: block;
  position: relative;
  margin-top: 5rem;
  transform: scale(0.6);
  padding: 10rem 0 ;

  @media (min-width: $m) {
      transform: none;
      padding-bottom: 0;
      padding: 10rem 0 ;
  }
}

.gm-out {
  animation: spin 20s linear infinite;
  transform-origin: 0% 0% ;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  transform: rotate(360deg) translate(-50%, -50%);
}

@media not all and (min-resolution:.001dpcm) { @supports (-webkit-appearance:none) and (stroke-color:transparent) { 
  .gm-out  { animation: none; } 
} }

.gm-in {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); 
  z-index: 1;
}

@keyframes go {
  0% {
    transform: translate(-300px, 100px);
  }
  20% {
    transform: translate(-300px, 100px);
  }
  50% {
    transform: translate(-300px, 100px);
  }
  90% {
    transform: translate(0px, -300px);
  }
  100% {
    transform: translate(0px, -300px);
  }
}
</style>


