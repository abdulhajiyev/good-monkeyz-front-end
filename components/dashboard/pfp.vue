<template>
    <div class="interface"> 
        <div class="options">
            <span class="btn" @click="setShopURL()">SET MERCH ADDRESS</span>
            <span class="btn" @click="flipPass()">PASS {{monkeyPass ? 'OPEN' : 'CLOSED'}}</span>
            <span class="btn" @click="flipAllow()">ALLOW {{ monkeyAllow ? 'OPEN' : 'CLOSED'}}</span>
            <span class="btn" @click="flipPublic()">PUBLIC {{monkeyPublic ? 'OPEN' : 'CLOSED'}}</span>
            <span class="btn" @click="flipBooster()">BOOSTER {{monkeyBooster ? 'OPEN' : 'CLOSED'}}</span>
            <span class="btn" @click="setBaseURI()">setBaseURI</span>
            <span class="btn" @click="setContractURI()">setContractURI</span>
            <span class="btn" @click="withdraw()">Withdraw</span>
        </div>
        <div class="data">
            <h2>MONKEY Contract</h2>
            <h3>{{monkeyContract}} [{{networkName}}]</h3>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { ethers } from 'ethers';

import { 
  MERCH_DROP_CONTRACT,
  MONKEY_CONTRACT,
  INFURA_PROJECT_ID,
  NETWORK_NAME,
  TOKEN_ID_MERCH_BUNDLE
} from '@/utils/constants';

import GMPFP from '@/utils/GoodMonkeyz.json';

export default {
  transition: 'mint',
  name: 'pre-merch',
  components: {
  },
  data: () => {
    return {
      bal: 0,
      merchBundleId: TOKEN_ID_MERCH_BUNDLE,
      monkeyContract: MONKEY_CONTRACT,
      networkName: NETWORK_NAME,
      monkeyPass: false,
      monkeyAllow: false,
      monkeyPublic: false,
      monkeyBooster: false,
      provider: null,
      signer: null,
      connectedMonkey: null,
    }
  },
  computed: {
    ...mapState(['wallet', 'provider']),
  },
  created() {
      this.getMonkeyData();
  },
  methods: {
    formatEth(bigNum) {
        return parseFloat(ethers.utils.formatEther(bigNum)).toFixed(2);
    },
    withdraw(){
        const provider = this.$provider();
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, signer);

        connectedContract.withdraw()
    },
    async getMonkeyData() {
      const provider = new ethers.providers.InfuraProvider(NETWORK_NAME, INFURA_PROJECT_ID);
      const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, provider);

      this.monkeyPass = await monkeyContract.MINTPASS()
      this.monkeyPublic = await monkeyContract.PUBLIC()
      this.monkeyAllow = await monkeyContract.ALLOW()
      this.monkeyBooster = await monkeyContract.BOOSTER()

    },
    async setShopURL() {
      const provider = this.$provider();
      const signer = provider.getSigner();
      const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, signer);

      await monkeyContract.setMerchAddress(MERCH_DROP_CONTRACT);
    },
    async flipPass() {
      const provider = this.$provider();
      const signer = provider.getSigner();
      const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, signer);

      await monkeyContract.flipPassState();
    },
    async flipAllow() {
      const provider = this.$provider();
      const signer = provider.getSigner();
      const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, signer);

      await monkeyContract.flipAllowState();
    },
    async flipPublic() {
      const provider = this.$provider();
      const signer = provider.getSigner();
      const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, signer);

      await monkeyContract.flipPublicState();
    },
    async flipBooster() {
      const provider = this.$provider();
      const signer = provider.getSigner();
      const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, signer);

      await monkeyContract.flipBoosterState();
    },
    async setBaseURI() {
      const provider = this.$provider();
      const signer = provider.getSigner();
      const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, signer);

      await monkeyContract.setBaseURI('ipfs://QmcLTV9TN2CTzqN6bYG5wcCf6tkQ2Y8bMNCNZvGRmjDNwb/');
    },
    async setContractURI() {
      const provider = this.$provider();
      const signer = provider.getSigner();
      const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, signer);

      await monkeyContract.setContractURI('https://sambillingham.github.io/test-json/contract_meta.json');
    },
  
  }
}
</script>

<style scoped>
  .mint-enter-active, .mint-leave-active { 
    transition: opacity .7s, transform .7s; 
  }
  .mint-enter, .mint-leave-active { 
    opacity: 0;
    transform: scale(1.2);
  }

    .bal {
        background: #000;
        color: #fff;
        padding: 0.35rem;
        font-size: 12px;
        transform: translate(10px, -50%);
    }
h2 {
    text-transform: uppercase;
    font-weight: 700;
    font-size: 15px;
}
h3 {
    text-transform: uppercase;
    font-weight: 700;
    font-size: 11px;
}
ul {
    list-style: none;
    padding: 0;
}

.admin {
  background: #f8f8f8;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.interface {
    padding: 1rem;
    font-family: 'Courier New', Courier, monospace;
    display: flex;
    flex-wrap: wrap;
    max-width: 800px;
}
.data {
    border:  1px dotted #000;
    padding: 1rem;
    position: relative;
    flex-grow: 1;
}
.options,
.allow-list {
    border:  1px dotted #000;
    display: flex;
    flex-direction: column;
}

.allow-list {
  flex-basis: 100%;
  padding: 1rem;
}


.btn {
    background: #000;
    padding: 1rem;
    color: #fff;
    cursor: pointer;
    z-index: 1;
    margin: 0.5rem 1rem;
}
.btn:first-of-type {
    margin-top: 1rem;
}
.btn:last-of-type { 
    margin-bottom: 1rem;
}

</style>


