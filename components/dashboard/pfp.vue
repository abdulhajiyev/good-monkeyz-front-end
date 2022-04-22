<template>
    <div class="interface"> 
        <div class="options">
            <span class="btn" @click="setShopURL()">SET MERCH ADDRESS</span>
            <span class="btn" @click="setProvenance()">SET Provenance</span>
            <span class="btn" @click="generateIndex()">Generate Index</span>
            <span class="btn" @click="flipPass()">PASS {{monkeyPass ? 'OPEN' : 'CLOSED'}}</span>
            <span class="btn" @click="flipAllow()">ALLOW {{ monkeyAllow ? 'OPEN' : 'CLOSED'}}</span>
            <span class="btn" @click="flipPublic()">PUBLIC {{monkeyPublic ? 'OPEN' : 'CLOSED'}}</span>
            <span class="btn" @click="flipBooster()">BOOSTER {{monkeyBooster ? 'OPEN' : 'CLOSED'}}</span>
            <span class="btn" @click="setBaseURI()">setBaseURI</span>
            <span class="btn" @click="setContractURI()">setContractURI</span>
            <span class="btn" @click="withdraw()">Withdraw</span>

            --
            <span class="btn" @click="setNewPrice()">setNewPrice</span>
            <span class="btn" @click="setNewAllowMax()">setNewAllowMax</span>
            <span class="btn" @click="setNewPublicMax()">setNewPublicMax</span>
        </div>
        <div class="data">
            <span class="bal">Contract: {{formatEth(bal)}}Ξ</span>
            <h2>MONKEY Contract</h2>
            <h3>{{monkeyContract}} [{{networkName}}]</h3>
            
            <h3>contractUri: </h3><span class="uri">{{contractUri}}</span >
            <h3>baseURI: </h3><span class="uri">{{baseURI}}</span >


            <h3>provenanceHash: {{provenanceHash}}</h3>
            <h3>prizeListHash: {{prizeListHash}}</h3>

            <h3>Starting Index: {{startingIndex}}</h3>
            <h3>Prize Index: {{prizeIndex}}</h3>

            <h3>GMEditionsAddress: {{GMEditionsAddress}} {{merchAddressMatch ? 'MATCH' : 'NO MATCH' }}</h3>

            <h3>PublicMinting Max Per TX: {{publicMintMax}} </h3>
            <h3>AllowMinting Max per Wallet: {{allowMintMax}} </h3>

            <h3>Price {{price}} </h3>
            <h3>double Price: {{doublePrice}} </h3>


        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { ethers } from 'ethers';

import { 
  MERCH_DROP_CONTRACT,
  MONKEY_CONTRACT,
  ALCHEMY_API,
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
      connectedMonkey: null,
      startingIndex: null,
      prizeIndex: null,
      GMEditionsAddress: null,
      merchAddressMatch: null,
      price: null, 
      doublePrice: null,
      provenanceHash: null,
      prizeListHash: null,
      contractUri: null,
      baseURI: null,
      allowMintMax: null,
      publicMintMax: null,
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
      const provider = new ethers.providers.AlchemyProvider(NETWORK_NAME, ALCHEMY_API);;
      const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, provider);
      this.bal = await provider.getBalance(monkeyContract.address);

      this.monkeyPass = await monkeyContract.MINTPASS()
      this.monkeyPublic = await monkeyContract.PUBLIC()
      this.monkeyAllow = await monkeyContract.ALLOW()
      this.monkeyBooster = await monkeyContract.BOOSTER()
      
      this.startingIndex = await monkeyContract.startingIndex()
      this.prizeIndex = await monkeyContract.prizeIndex()

      this.prizeIndex = await monkeyContract.prizeIndex()
      this.GMEditionsAddress = await monkeyContract.GMEditionsAddress()
      this.merchAddressMatch = this.GMEditionsAddress === MERCH_DROP_CONTRACT

      this.publicMintMax = await monkeyContract.publicMintMax()
      this.allowMintMax = await monkeyContract.allowMintMax()

      this.price = await monkeyContract.price();
      this.doublePrice = await monkeyContract.doublePrice();

      this.provenanceHash = await monkeyContract.provenanceHash();
      this.prizeListHash = await monkeyContract.prizeListHash();
      this.contractUri = await monkeyContract.contractURI();
      this.baseURI = await monkeyContract.tokenURI(1);
    },
    async setProvenance(){
      const provider = this.$provider();
      const signer = provider.getSigner();
      const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, signer);

      const _provenanceHash = '48c50aa8d9203259291d330020c4478a57e80d111d15c4cec709b693b76ee50d'
      const _prizeListHash = 'df41a7dc64c25db15edf491d7b835d2a923990e1bf00bff59df9624658ffac3d'
      await monkeyContract.setProvenance(_provenanceHash, _prizeListHash);
    },
    async setNewPrice(){
      const provider = this.$provider();
      const signer = provider.getSigner();
      const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, signer);

      const _price = ethers.utils.parseEther('0.077')
      const _doublePrice = ethers.utils.parseEther('0.1337')
      await monkeyContract.setNewPrice(_price, _doublePrice);
    },
    async setNewPublicMax(){
      const provider = this.$provider();
      const signer = provider.getSigner();
      const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, signer);

      await monkeyContract.setNewPublicMax(7);
    },
    async setNewAllowMax(){

      const provider = this.$provider();
      const signer = provider.getSigner();
      const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, signer);

      await monkeyContract.setNewAllowMax(2);
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

      await monkeyContract.setBaseURI('ipfs://QmPpYDfHmXU8e5cbQvJ4JpB8dexmfzNb5XD8MXdWwxkVaQ/');
    },
    async setContractURI() {
      const provider = this.$provider();
      const signer = provider.getSigner();
      const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, signer);

      await monkeyContract.setContractURI('');
    },
    async generateIndex() {
      const provider = this.$provider();
      const signer = provider.getSigner();
      const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, signer);

      await monkeyContract.genStartingIndex();
    }
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
.uri {
  display: block;
  font-size: 11px;
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
    max-width: 900px;
    justify-self: center;
    align-self: center;
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


