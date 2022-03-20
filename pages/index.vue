<template>
  <div class="index">
    <div class="splash">
      <div class="banner banner--top">
        <span  class="marquee">GOOD MONKEYZ MINTING 2022 <img :src="star"> GOOD MONKEYZ MINTING 2022 <img :src="star"> GOOD MONKEYZ MINTING 2022 <img :src="star"> GOOD MONKEYZ MINTING 2022 <img :src="star"> </span>
      </div>
      <div class="nav">  
        <MinBanner :account="wallet" :active="true" />
      </div>
      <video class="video-bg" width="55%" autoplay muted loop :src="monkey"></video> 
      <div class="fade-bg"></div> 
      <div class="banner banner--bottom">
        <span  class="marquee">GOOD MONKEYZ MINTING 2022 <img :src="star"> GOOD MONKEYZ MINTING 2022 <img :src="star"> GOOD MONKEYZ MINTING 2022 <img :src="star"> GOOD MONKEYZ MINTING 2022 <img :src="star"> </span>
      </div>
    </div>
    <div class="monkeyz" id="about">
      <div class="fade-bg fade--monkey"></div> 
      <div class="lead">
        <h2>Good Monkeyz are a collection of 10,000 generated NFTs living on the Ethereum blockchain</h2>
      </div>
      <div></div>
      <div class="monkeyz-scroll">
        <div class="m-scroll m-scroll--1">
          <img :src="m1" ><img :src="m1" ><img :src="m1" >
        </div>
        <div class="m-scroll m-scroll--2">
          <img :src="m2" ><img :src="m2" ><img :src="m2" >
        </div>
        <div class="m-scroll m-scroll--3">
          <img :src="m3" ><img :src="m3" ><img :src="m3" >
        </div>
        <div class="m-scroll m-scroll--4">
          <img :src="m4" ><img :src="m4" ><img :src="m4" >
        </div>
      </div>
    </div>
  

    <div class="faq" id="faq">
      <h2>FAQ</h2>
      <div class="faq-list">
        <div @click="openfaq(item.id)" class="faq-list__item" v-for="item in faq" :key="item.id">
          <h3 class="faq-item__question">{{item.q}}</h3>
          <span :class="{ active: item.active }" class="faq-item__close">&times;</span>
            <p class="faq-item__answer">
              {{item.a}}
            </p>
        </div>
      </div>
    </div>

    <div class="banner banner--middle">
      <span class="marquee">MEET THE GOOD MONKEYZ MEET THE GOOD MONKEYZ MEET THE GOOD MONKEYZ MEET THE GOOD MONKEYZ</span>
    </div>


    <div class="team" id="team">
      <div class="monkey">
        <div class="monkey__avatar">
            <img :src="monkey1" >
        </div>
        <div class="monkey__info">
            <h3>CHARLESP</h3>
            <h4>CREATIVE</h4>
            <h5>@CHARLESPATTSON</h5>
        </div>
      </div>
      <div class="monkey">
        <div class="monkey__info monkey__info--right">
            <h3>SAMMYB</h3>
            <h4>DEVELOPMENT</h4>
            <h5>@SAM_BILLINGHAM</h5>
        </div>
        <div class="monkey__avatar">
            <img :src="monkey2" >
        </div>
      </div>
       <div class="monkey">
        <div class="monkey__avatar">
            <img :src="monkey3" >
        </div>
        <div class="monkey__info">
            <h3>monkey2,</h3>
            <h4>COMMUNITY</h4>
            <h5>@JULIA91990</h5>
        </div>
      </div>
    </div>

    <div class="good-things">
      <p>GOOD THINGS COME TO GOOD MONKEYZ WHO WAIT. COMING APRIL 2022.</p>
    </div>
    
    <div class="gm-full">
        
        <div class="gm-spinner">
          <img class="gm-in" :src="gmIn">
          <img class="gm-out" :src="gmOut">
        </div>

        <div class="spotlight spotlight--a"></div>
        <div class="spotlight spotlight--b"></div>
        <div class="spotlight spotlight--c"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import MinBanner from '@/components/MinBanner.vue';
import monkey from "@/assets/video/mm-med.mp4";
import divider from "@/assets/img/divider.svg";
import star from "@/assets/img/star-black.svg";

import m1 from "@/assets/img/monkey-group-1.png";
import m2 from "@/assets/img/monkey-group-2.png";
import m3 from "@/assets/img/monkey-group-3.png";
import m4 from "@/assets/img/monkey-group-4.png";

import monkey1 from "@/assets/img/monkey-1.png";
import monkey2 from "@/assets/img/monkey-2.png";
import monkey3 from "@/assets/img/monkey-3.png";
// import gmFull from '@/assets/img/gm-full.svg';
import gmOut from "@/assets/img/gm-outer.svg";
import gmIn from "@/assets/img/gm-inner.svg";

export default {
  transition: 'index',
  name: 'Index',
  components: {
    MinBanner,
  },
  data: () => {
    return {
      monkey,
      divider,
      star,
      m1,m2,m3,m4,
      faq: [
        {
          id: 0,
          q: 'Mint Price?',
          a: '0.077 ETH',
          active: false,
        },
        {
          id: 1,
          q: 'Mint Date',
          a: '14th April LFG!',
          active: false,
        },
        {
          id: 2,
          q: 'Wen Merch? How merch?',
          a: 'Buy a token during the limted edition mint - or on the secondary market.',
          active: false,
        },
        {
          id: 3,
          q: 'Whats in the Merch Bundle',
          a: '1 Hoodie, 1 cap or Beanie, Sticker Pack, 1 Mint Pass NFT',
          active: false,
        },
        {
          id: 4,
          q: 'What is the mint pass',
          a: 'Mint passes can be exchanged for 1 Monkey for 0ETH Fee - will still require gas',
          active: false,
        },
      ],
      monkey1,
      monkey2,
      monkey3,
      // gmFull,
      gmOut,
      gmIn,
      
    }
  },
  computed: mapState(['wallet']),
  created() {
  },
  methods: {
    openfaq(id){
      this.faq[id].active = !this.faq[id].active;
    },
  }
}
</script>

<style scoped>
.index-enter-active, .index-leave-active { 
  transition: opacity 0.7s, transform .5s; 
}
.index-enter, .index-leave-active { 
  opacity: 0;
}
  .index {
    background: #000;
    /* width: 100%;
    display: flex;
    justify-content: space-between;
    min-height: 100vh; */
    overflow: hidden;
  }

  .video-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    filter: grayscale(30%);
    z-index: 0;
    width: 100%;
    /* transform: scale(1.4); */
  }
  @media (min-width: 700px){
    .video-bg {
      
    }
  }
  .fade-bg {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(180deg, #000000 12.4%, rgba(0, 0, 0, 0) 100%);
    z-index: 0;
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
      font-size: 3.3rem;
      white-space: nowrap;
      pointer-events: none;
      position: absolute;
      background: #fff;
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
      animation: marquee 60s linear infinite;
    }
    .marquee img{
      height: 2.4rem;
    }
  .nav {
    position: relative;
  }

  .monkeyz {
    padding: 6rem 0;
    position: relative;
    overflow: hidden;
  }
  .lead {
    max-width: 80%;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  h2  {
    font-weight: 900;
    font-size: 3.6rem;
    color: #fff;
  }
  .m-scroll {
    display: flex;
    flex-wrap: nowrap;
    padding: 0.75rem 0 ;
    animation: scroll 50s ease-in-out alternate infinite;
  }
  .m-scroll img {
    max-height: 8rem;
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

  .faq-list  {

  }

  .faq-list__item {
    padding: 1.5rem 2rem;
    background: #2B2B2B;
    position: relative;
    margin-bottom: 2rem;
    transition: ease-in-out 300ms;
  }
  .faq-list__item:last-of-type {
    margin-bottom: 0;
  }

  .faq-item__close {
    position: absolute;
    font-size: 3rem;
    color: #fff;
    top: 1.4rem;
    right: 1.5rem;
    font-family: Arial, Helvetica, sans-serif;
    cursor: pointer;
    transform: rotate(135deg);
    transition: ease-in-out 300ms;
  }
  .faq-item__close.active {
     transform: rotate(90deg);
  }

  .faq-item__question {
    background: #2B2B2B;
    color: #fff;
    font-size: 2rem;
    margin: 0;
  }

  .faq-item__answer {
    background: #2B2B2B;
    color: #fff;
  }
  .faq-item__answer.active {
    display: block;
  }

  .banner--middle {
    color: #fff;
    padding: 4rem 0;
    background: #000;
    font-size: 6rem;
    position: static;
  } 

  .team {
    max-width: 80%;
    margin: 0 auto;
  }
  .monkey {
    display: flex;
    flex-direction: row;
    margin-bottom: 10rem;
  }
  .monkey:last-of-type {
     /* margin-bottom: 0; */
     padding-bottom: 8rem;
  }
  .monkey__avatar {
    max-width: 100%;
    flex-basis: 40%;
  }
  .monkey__avatar img {
    max-width: 100%;
  }
  .monkey__info {
    flex-basis: 60%;
  }
  .monkey__info h3{
    color: #fff;
    font-size: 6rem;
    margin: 0;
    line-height: 1;
    transform: translateX(-25%);
    margin-top: 2rem;
  }
  .monkey__info h4 {
    color: rgba(255,255,255,0.6);
    font-size: 2.6rem;
    margin: 0;
    line-height: 1;
    margin-left: 1rem;
  }
  .monkey__info h5 {
    color: rgba(255,255,255,0.3);
    font-size: 2.6rem;
    margin: 0;
    line-height: 1;
    margin-left: 1rem;
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
    font-size: 8rem;
    line-height: 1;
    color: #fff;
  }

  .gm-full {
    text-align: center;
    padding-bottom: 20rem;
    position: relative;
    /* overflow: hidden; */
  }
  /* .gm-full img {
    position: relative;
    z-index: 1;
  } */
  .spotlight {
    width: 65%;
    height: 550px;
    opacity: 0.6;
    filter: blur(100px);
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 0;
    border-radius: 50%;
  }

  .spotlight--a {
    background: #FF7A41;
  }

  .spotlight--b {
    background: #C509DD;
    width: 20%;
    left: 20%;
    bottom: -40%;
  }
  .spotlight--c {
    background: #03A3D6;
    left: auto;
    right: -10%;
    bottom: -20%;
  }


  @keyframes spin {
  from { transform: rotate(0deg) translate(-50%, -50%)}
  to { transform: rotate(360deg) translate(-50%, -50%)}
}

.gm-spinner {
  display: inline-block;
}

.gm-out {
  animation: spin 20s linear infinite;
  transform-origin: 0% 0% ;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.gm-in {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); 
  z-index: 1;
}
</style>


