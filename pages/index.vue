<template>
  <div class="index">
    <section class="splash">
      <div class="banner banner--top">
        <span  class="marquee">GOOD MONKEYZ MINTING 2022 <img :src="star"> GOOD MONKEYZ MINTING 2022 <img :src="star"> GOOD MONKEYZ MINTING 2022 <img :src="star"> GOOD MONKEYZ MINTING 2022 <img :src="star"> </span>
      </div>
      <div class="nav">  
        <MinBanner :account="wallet" :active="true" />
      </div>
      <video class="video-bg" width="55%" autoplay muted loop :src="monkey"></video> 
      <div class="fade-bg"></div> 
      <img class="spotlight spotlight--hero" :src="spotlightHero" >
      <div class="banner banner--bottom">
        <span  class="marquee">GOOD MONKEYZ MINTING 2022 <img :src="star"> GOOD MONKEYZ MINTING 2022 <img :src="star"> GOOD MONKEYZ MINTING 2022 <img :src="star"> GOOD MONKEYZ MINTING 2022 <img :src="star"> </span>
      </div>
    </section>
    <section class="monkeyz" id="about">
      <div class="fade-bg fade--monkey"></div> 
      <div class="lead">
        <h2>Good Monkeyz are a collection of 10,000 generated NFTs living on the Ethereum blockchain</h2>
        <p>Created from a combination of hundreds of different traits, all good! You’ll be able to find some very special 1/1 in the collection that we’ve collaborated with our friends.</p>
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
    </section>
  

    <section class="faq" id="faq">
      <h2>FAQ</h2>
      <div class="faq-list">
        <div @click="openfaq(item.id)"  class="faq-list__item" v-for="item in faq" :key="item.id">
          <h3 class="faq-item__question">{{item.q}}</h3>
          <span :class="{ active: item.active }" class="faq-item__close">&times;</span>
          <Transition name="fade" mode="out-in">
            <p :key="item.active" v-if="item.active" class="faq-item__answer" v-html="item.a"></p>
          </Transition>
        </div>
      </div>
    </section>

    <section class="banner banner--middle">
      <span class="marquee">MEET THE GOOD MONKEYZ MEET THE GOOD MONKEYZ MEET THE GOOD MONKEYZ MEET THE GOOD MONKEYZ</span>
    </section>


    <section class="team" id="team">
      <div class="monkey">
        <img class="spotlight spotlight--charles" :src="spotlightCharles" >
        <div class="monkey__avatar" v-rellax data-rellax-speed="-1" data-rellax-percentage="0.6">
            <img :src="monkey1" >
        </div>
        <div class="monkey__info" v-rellax data-rellax-speed="0.4" data-rellax-percentage="0.3">
            <h3>CHARLESP</h3>
            <h4>CREATIVE</h4>
            <h5>@CHARLESPATTSON</h5>
        </div>
      </div>
      <div class="monkey">
        <img class="spotlight spotlight--sam" :src="spotlightSam" >
        <div class="monkey__info monkey__info--right" v-rellax data-rellax-speed="0.4" data-rellax-percentage="0.3">
            <h3>SAMMYB</h3>
            <h4>DEVELOPMENT</h4>
            <h5>@SAM_BILLINGHAM</h5>
        </div>
        <div class="monkey__avatar" v-rellax data-rellax-speed="-2.15" data-rellax-percentage="0.5">
            <img :src="monkey2" >
        </div>
      </div>
       <div class="monkey" >
        <div class="monkey__avatar" v-rellax data-rellax-speed="-1" data-rellax-percentage="0.5">
            <img :src="monkey3" >
        </div>
        <div class="monkey__info"  data-rellax-speed="0.4" data-rellax-percentage="0.5">
            <h3>JULIAF</h3>
            <h4>COMMUNITY</h4>
            <h5>@JULIA91990</h5>
        </div>
      </div>
    </section>

    <section class="good-things">
      <p>GOOD THINGS COME TO GOOD MONKEYZ WHO WAIT. COMING APRIL 2022.</p>
    </section>
    
    <div class="gm-full">
        
        <div class="gm-spinner">
          <img class="gm-in" :src="gmIn">
          <img class="gm-out" :src="gmOut">
        </div>

        <img class="spotlight spotlight--footer" :src="spotlightFooter" >
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
import gmOut from "@/assets/img/gm-outer.svg";
import gmIn from "@/assets/img/gm-inner.svg";

import spotlightFooter from "@/assets/img/spotlight-footer.png";
import spotlightCharles from "@/assets/img/spotlight-charles.png";
import spotlightSam from "@/assets/img/spotlight-sam.png";
import spotlightHero from "@/assets/img/spotlight-hero.png";

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
          q: 'What is the supply & Mint Price?',
          a: 'Maximum 10,000 Good Monkeyz available on the Ethereum Blockchain. Mint price is 0.077 ETH',
          active: true,
        },
        {
          id: 1,
          q: 'Wen Monkeyz? Mint Date?',
          a: "We are launching on April 26, 2022 at 2pm PST / 5pm EST.<br><br>NOTE: We will never have a stealth-launch, please be careful of scams.<br><br>Official launch details will be shared on our website, Discord, and our Twitter page.",
          active: false,
        },
        {
          id: 2,
          q: 'Early List & Public Mint?',
          a: '4000 Early list Spaces avaiable - anyone on the list has a reserved space to mint up to 2 GoodMonkeyz NFTs. 1000 (+remaning unminted from Early List) Public Mint. 250 Mint Passess. 250 Booster Packs.',
          active: false,
        },
        {
          id: 3,
          q: 'Wen Merch?',
          a: 'Merch Bundle tokens are now solely avaiable on the secondary market.<br><br> <a href="https://opensea.io/collection/good-monkeyz-limited-editions">Good Monkeyz Limited Editions</a>',
          active: false,
        },
        {
          id: 4,
          q: 'What Is A Merch Bundle?',
          a: 'A limited edition token. Max supply of 77 where minted. The NFT entitles the holder to 1 Hoodie, 1 cap or Beanie and a sticker Pack. Worldwide shipping is included. When minted holders also recived a 2nd NFT a Mint Pass',
          active: false,
        },
        {
          id: 5,
          q: 'What Is A Mint Pass?',
          a: 'Mint passes can be exchanged for 1 Monkey for 0ETH Fee - will still require gas. A Max supply of 250 Mint passes are mintable. 77 Mint passess were minted with the Merch Bundle. Future mint passess will be avaiable through limited edition drops and competitions.',
          active: false,
        },
        {
          id: 6,
          q: 'What Is A Booster Pack?',
          a: 'Booster packs contain 3 Monkeyz. There are a max supply of 250 booster packs. 77 initial distribution randomly to minters on the early list.',
          active: false,
        },
      ],
      monkey1,
      monkey2,
      monkey3,
      gmOut,
      gmIn,
      spotlightFooter,
      spotlightCharles,
      spotlightSam,
      spotlightHero,
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

<style scoped lang="scss">

$s: 660px;
$m: 960px;
$l: 1720px;


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s, transform .5s;
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
    filter: grayscale(30%);
    z-index: 0;
    width: 200%;
    @media (min-width: $s) {
      width: 100%;
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
    position: relative;
  }

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
      margin-left: 50%;
      max-width: 50%;
      font-size: 1.3rem;
    }
    @media (min-width: $m) {
      font-size: 1.4rem;
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
    font-size: 1.3rem;
    margin: 0;
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

  .faq-item__answer >>> a {
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
    }
  }
  .monkey__avatar img {
    max-width: 100%;
    
  }
  .monkey__info {
    
    position: relative;
    z-index: 1;

    flex-basis: 30%;
    max-width: 50%;
    padding-top: 50%;
    @media (min-width: $s) {
      flex-basis: 50%;
      padding-top: 50%;
    }
    @media (min-width: $m) {
      flex-basis: 60%;
      padding-top: 0;
    }
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
    font-size: 3.3rem;
    line-height: 1;
    color: #fff;
    z-index: 1;
    position: relative;
    @media (min-width: $s) {
      font-size: 6rem;
    }
    @media (min-width: $m) {
      font-size: 8rem;
    }
    @media (min-width: $l) {
      font-size: 12rem;
    }
  }


  .spotlight {
    width: 160%;
    position: absolute;
    z-index: 0;
    @media (min-width: $s) {
      width: 130%;
    }
    @media (min-width: $m) {
      width: 100%;
    }
  }
  .spotlight--hero{
    opacity: 0.25;
    width: 300%;
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
</style>


