<template>
  <div class="index">
    <div class="banner">
      <span class="marquee">Good monkeyz minting 2022   +   Good monkeyz minting 2022 + Good monkeyz minting 2022 + Good monkeyz minting 2022 + Good monkeyz minting 2022 +</span>
    </div>
    <Menu />
    <img class="bg-overlay" :src="bgOverlay" >
    
    <div class="info">
      <div class="minted">
        0 / 10,000 Minted
      </div>
      <div class="social">
        <img class="twitter" :src="twitter" >
        <img class="twitter" :src="twitter" >
        <img class="twitter" :src="twitter" >
      </div>
    </div>
    <div class="banner banner--bottom">
      <span class="marquee">Good monkeyz minting 2022   +   Good monkeyz minting 2022 + Good monkeyz minting 2022 + Good monkeyz minting 2022 + Good monkeyz minting 2022 +</span>
    </div>
  </div>
</template>

<script>

// import Menu from '@/components/Menu.vue';
import bgOverlay from "@/assets/img/gm-text.svg"
import twitter from "@/assets/img/twitter.svg"

export default {
  name: 'IndexPage',
  components: {
    // Menu,
  },
  data: () => {
    return {
      bgOverlay,
      twitter,
    }
  },
}
</script>

<style >

.info {
  position: absolute;
  bottom: 4rem;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: #fff;
  align-items: flex-end;
}
  .bg-overlay {
      mix-blend-mode: lighten;
      max-width: 100%;
      max-height: 90vh;
      padding-top: 10vh;
  }

.minted {
  padding-left: 2.5rem;
}
.social {
  padding-right: 1.5rem;
  transform: translateY(1rem);
}

  .twitter {
      width: 3rem;
  }


article {
  height: 400px;
  border: solid 2px #fff;
}

.banner {
  width: 100%;
  padding: 0.4rem 0;
  color: black;
  background: #fff;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 1.3rem;
  letter-spacing: 1px;
  font-family: Helvetica, sans-serif;
  height: fit-content;
  overflow: hidden;
  white-space: nowrap;

  position: absolute;
  top: 0;
  left: 0;
}
.banner--bottom {
  top: auto;
  bottom: 0;
}

.marquee {
  display: block;
  will-change: transform;
  animation: marquee 32s linear infinite;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

</style>


