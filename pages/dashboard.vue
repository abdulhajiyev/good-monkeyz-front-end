<template>
  <div class="shop">
    <Menu :account="wallet"/>
    <div class="heading">
        <h1>You're in! LFG</h1>
        <h2>You are eligible for the Good Monkeyz merch drop</h2>
    </div>
    <div class="grid">
      <div v-for="item in merch" :key="item.title" class="item">
        <video muted autoplay loop :src="item.img"></video>
        <span class="btn">Redeem Item</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState} from 'vuex'

import Menu from '@/components/Menu.vue';

import monkey from "@/assets/video/mm.mp4";



export default {
  name: 'Dashboard',
  components: {
    Menu,
  },
  data: () => {
    return {
      monkey,
      merch: [
        {
          title: 'Hoodie',
          id: '0',
          img: monkey,
        },
        {
          title: 'Hat',
          id: '1',
          img: monkey,
        },
      ],
    }
  },
  computed: mapState(['wallet']),
  created() {
  },
  methods: {
  },

}
</script>

<style scoped>
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
}
.item .supply {
  position: absolute;
  color: #fff;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 1;
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


