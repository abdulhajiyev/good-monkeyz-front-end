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
import monkey from "@/assets/video/mm.mp4";

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

<style scoped>
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
  max-width: 25%;
  margin: 1rem;
  padding: 1rem;
  border-radius: 2rem;
  box-shadow: 0px 34px 84px rgba(0, 0, 0, 0.09);
  position: relative;
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
    padding: 6rem 0 2rem;
    text-align: center;
}
.heading h1 {
    font-size: 4rem;
    text-transform: uppercase;
    margin: 0;
}
.heading h2 {
    margin: 0;
    font-family: Helvetica, sans-serif;
    font-size: 1.0rem;
    font-weight: 300;
}

</style>


