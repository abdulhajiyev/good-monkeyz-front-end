<template>
    <div class="interface"> 
        <div class="options">
            <span class="btn" @click="addMerchItem()">Add Merch Item</span>
            <span class="btn" @click="updateMerchItem()">Update Merch Item</span>
            <span class="btn" @click="updateURI()">updateURI</span>
            <span class="btn" @click="withdraw()">Withdraw</span>
            <span class="btn" @click="adminMint()">adminMint</span>
        </div>
        <div class="data">
            <div>
              <span class="bal">Contract: {{formatEth(bal)}}Ξ</span>
              <span class="bal">Deployer: {{formatEth(deployerBal)}}Ξ</span>
              <span class="bal">Vault: {{formatEth(vaultBal)}}Ξ</span>
            </div>
            <h2>Merch Drop Contract</h2>
            <h3>{{merchContract}} [{{networkName}}]</h3>
            <h3></h3>
            <ul>
                <li>Available Contract Items: {{merchCount}}</li>
            </ul>
            <ul>
            <li v-for="(item, index) in merch" :key="index">
                {{index }}: <span v-html="mintStatus(index)"></span> - {{merchData[index].name}} -- {{formatEth(merch[index].price)}}Ξ -- {{merch[index].minted}} /{{merch[index].supply}}
            </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { ethers } from 'ethers';

import { 
  MERCH_DROP_CONTRACT,
  ALCHEMY_API,
  NETWORK_NAME,
  TOKEN_ID_MERCH_BUNDLE
} from '@/utils/constants';

import GMSHOPJSON from '@/utils/nftShop.json';

export default {
  transition: 'mint',
  name: 'pre-merch',
  components: {
  },
  data: () => {
    return {
      bal: 0,
      deployerBal: 0,
      vaultBal: 0,
      merchCount: 0,
      merchBundleId: TOKEN_ID_MERCH_BUNDLE,
      merchContract: MERCH_DROP_CONTRACT,
      networkName: NETWORK_NAME,
      merch: [],
      merchData: [
          {
              name: 'Merch Bundle',
          },
          {
              name: 'Mint Pass',
          },
          {
              name: 'Booster Pack',
          },
          {
              name: 'OG Badge',
          },
          {
              name: 'Mystery Box',
          }
    ],
    allowList: [],
    mintList: [],
    }
  },
  computed: {
    ...mapState(['wallet', 'provider']),
  },
  created() {
      this.getcontractData();
      this.getAllowList();

  },
  methods: {
    mintStatus(id) {
        return (this.merch[id].allowMintable ? 'ALLOW ' : '<s>ALLOW</s> ') + (this.merch[id].publicMintable ? 'PUBLIC ' : '<s>PUBLIC</s>')
    },
    formatEth(bigNum) {
        return parseFloat(ethers.utils.formatEther(bigNum)).toFixed(2);
    },
    getMintStatus(address){
      if(this.mintList){
        const item = this.mintList.filter(ad => ad.address === address)[0];
        if(item){
          return item.minted
        }
      }
    },
    async adminMint() {
      const provider = this.$provider();
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, signer);

      const tx =  await connectedContract.mintAdmin(
        '0x179a304E5E87dA8D059fC65bE11d7635b4Ea9f69',
        0,
        0
      );
      console.log(tx);
    },
    async getcontractData() {
      const provider = new ethers.providers.AlchemyProvider(NETWORK_NAME, ALCHEMY_API);;
      const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, provider);
      this.merchCount =  await connectedContract.getMerchCount();
      this.bal = await provider.getBalance(connectedContract.address);
      this.deployerBal = await provider.getBalance('0x179a304E5E87dA8D059fC65bE11d7635b4Ea9f69');
      this.vaultBal = await provider.getBalance('goodmonkeyz.eth');

        for (let index = 0; index < this.merchCount; index++) {
            this.merch.push(await connectedContract.merch(index))
        }
        console.log(this.merch)
  
    },
    withdraw(){
        const provider = this.$provider();
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, signer);

        connectedContract.withdraw()
    },
    async updateURI() {
       try {
        const provider = this.$provider();
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, signer);

        const URI = 'ipfs://QmYub1BLEvEd1ZLj9nFWwbfcNmgoqE3NrhwXPZ9mZfoCDz/{id}.json'
        const tx = await connectedContract.setURI(URI)
        console.log(tx)

      } catch (error) {
        console.log(error)
      }
    },
    async addMerchItem() {
        try {
            const provider = this.$provider();
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, signer);

            const tx = await connectedContract.createMerchItem(
                  1337,
                  ethers.utils.parseEther('1'),
                  ethers.utils.parseEther('0.000')
                )
            console.log(tx)

        } catch (error) {
          console.log(error)
        }
     },
        async updateMerchItem() {
        try {
            const provider = this.$provider();
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, signer);

            // INDEX
            // SUPPLY
            // PRICE
            // INCREMENT
            // INTERVAL
            // ALLOW LIST
            // PUBLIC
            // INCL MINT PASS
            const tx = await connectedContract.updateMerchItem(
                    0, 
                    77,
                    ethers.utils.parseEther('0.105'),
                    ethers.utils.parseEther('0.000'),
                    77,
                    true,
                    true,
                    true );
            console.log(tx)

        } catch (error) {
          console.log(error)
        }
     },
    async getAllowList(){
      const provider = new ethers.providers.AlchemyProvider(NETWORK_NAME, ALCHEMY_API);;
      const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, provider);

      const list = await (await fetch(`/.netlify/functions/allow-list`)).json()
      this.allowList = list.data;
      console.log(this.allowList)
      

      const addressList = list.data.map( user => user.address ).filter(x => x)
      const ids = Array.from('0'.repeat(addressList.length))
      const balances = await connectedContract.balanceOfBatch(addressList,ids)
      const b = balances.map( bal => ethers.utils.formatUnits(bal, 0) );
      
      this.mintList = addressList.map( (ad, index) => {
        return {
          address: ad,
          minted: b[index] === '1'
        }
      })

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


