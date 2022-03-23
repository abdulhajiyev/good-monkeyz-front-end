<template>
  <div class="shop">
    <MinBanner :account="wallet" :active="true" color="black" />
    <div class="heading">
        <h1>You're in! LFG </h1> 
        <h2>You are eligible for the Good Monkeyz merch drop</h2>
    </div>
    <div class="grid">
      <div class="item">
        <video muted autoplay loop :src="monkey"></video>
        <nuxt-link to="/merch/options" class="btn">Redeem Item</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import MinBanner from '@/components/MinBanner.vue';
import monkey from "@/assets/video/mm-med.mp4";

export default {
  transition: 'scale',
  name: 'Redeem',
  middleware: 'merchOwner',
  components: {
    MinBanner,
  },
  data: () => {
    return {
      monkey,
    }
  },
}
</script>

<style scoped lang="scss">
$s: 660px;
$m: 960px;
$l: 1720px;

.scale-enter-active, .scale-leave-active { 
  transition: opacity 0.6s, transform .5s; 
}
.scale-enter, .scale-leave-active { 
  opacity: 0;
  transform: scale(0.95);
}

main {
  background: #fff;
}

.grid {
  display: flex;
  justify-content: center;
}

.item {
  max-width: 80%;
  margin: 1rem;
  padding: 1rem;
  border-radius: 2rem;
  box-shadow: 0px 34px 84px rgba(0, 0, 0, 0.09);
  position: relative;
  @media (min-width: $s) {
      max-width: 50%;
  }
  @media (min-width: $m) {
      max-width: 25%;
  }
}

.item video{
  max-width: 100%;
  border-radius: 1rem;
  margin-bottom: 1rem;
}

.item .btn {
  background-color: #000;
  color: #fff;
  text-align: center;
  display: block;
  border-radius: 1rem;
  font-size: 0.75rem;
  padding: 0.5rem;
  cursor: pointer;
  text-transform: uppercase;
  text-decoration: none;
}

.heading {
  padding: 8rem 0 0;
  text-align: center;

  @media (min-width: $m) {
    padding: 6rem 0 2rem;
  }
}
.heading h1 {
  font-size: 2.2rem;
  text-transform: uppercase;
  margin: 0;

  @media (min-width: $m) {
    font-size: 3.2rem;
  }
  @media (min-width: $m) {
    font-size: 4rem;
  }
}
.heading h2 {
    margin-top: 0.5rem;
    font-family: Helvetica, sans-serif;
    font-size: 0.9rem;
    font-weight: 300;

    @media (min-width: $m) {
      margin: 0;
      font-size: 1.0rem;
    }
    @media (min-width: $m) {
      font-size: 1.0rem;
    }
}

</style>


