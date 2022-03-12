<template>
  <div class="shop">
    <Menu :account="wallet"/>
    <div class="heading">
        <h1>ERROR! NGMI</h1>
        <!-- <h2>You are eligible for the Good Monkeyz merch drop</h2> -->
    </div>
  </div>
</template>

<script>
import { mapState} from 'vuex'

import Menu from '@/components/Menu.vue';

export default {
  name: 'NGMI',
  components: {
    Menu,
  },
  data: () => {
    return {
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


