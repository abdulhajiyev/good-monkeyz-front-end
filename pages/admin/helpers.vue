<template>
  <div class="admin">
      
      <MerchInterface />
      <PFPInterface />
      <div class="interface">
        <div class="allow-list">
          <!-- <h2>Merch Allow List - Database</h2>
            <ul>
              <li v-for="(item, index) in allowList" :key="index">
                  {{index }}: {{item.screen_name }}: {{item.address }}: {{getMintStatus(item.address) ? "Minted" : 'X'}}
              </li>
            </ul> -->
        </div>
        <!-- <div class="allow-list">
          <h2>Merch Allow List - Database</h2>
            <ul>
              <li v-for="(item, index) in allowList" :key="index">
                  {{index }}: {{item.screen_name }}: {{item.address }}: {{getMintStatus(item.address) ? "Minted" : 'X'}}
              </li>
            </ul>
        </div> -->
      </div>
  </div>
</template>

<script>

import MerchInterface from '@/components/dashboard/merch';
import PFPInterface from '@/components/dashboard/pfp';



export default {
  transition: 'mint',
  name: 'pre-merch',
  components: {
    MerchInterface,
    PFPInterface,
  },
  data: () => {
    return {
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
  }
}
</script>

<style scoped>
 

</style>


