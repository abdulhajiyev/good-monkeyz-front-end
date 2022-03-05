<template>
  <div class="admin">
      <div class="interface">
        <div class="options">
            <span class="btn" @click="updateAllowList()">Update Allow List</span>
            <span class="btn" @click="addMerchItem()">Add Merch Item</span>
            <span class="btn" @click="updateMerchItem()">Update Merch Item</span>
            <span class="btn" @click="withdraw()">withdraw</span>
            <div class="">
                <!-- <h2>Update Merch Item</h2> -->
            </div>
        </div>
        <div class="data">
            <span class="bal">Balance: {{formatEth(bal)}}Ξ</span>
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ethers } from 'ethers';

import { 
  MERCH_DROP_CONTRACT,
  INFURA_PROJECT_ID,
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
          }
      ]
    }
  },
  computed: {
    ...mapState(['wallet', 'provider']),
    // formattedMerch() {
    //     return this.merch.map( m => {
    //         return {
    //             m
    //         }
    //     })
    // }
  },
  created() {
      this.getcontractData();
  },
  methods: {
    mintStatus(id) {
        return (this.merch[id].allowMintable ? 'ALLOW ' : '<s>ALLOW</s> ') + (this.merch[id].publicMintable ? 'PUBLIC ' : '<s>PUBLIC</s>')
    },
    formatEth(bigNum) {
        return ethers.utils.formatEther(bigNum);
    },
    async getcontractData() {
      const provider = new ethers.providers.InfuraProvider(NETWORK_NAME, INFURA_PROJECT_ID);
      const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, provider);
      this.merchCount =  await connectedContract.getMerchCount();
      this.bal = await provider.getBalance(connectedContract.address);
        for (let index = 0; index < this.merchCount; index++) {
            this.merch.push(await connectedContract.merch(index))
        }
        console.log(this.merch)
    
    // const merchCount = await GMMerchBundle.connect(owner).getMerchCount();
    // console.log(merchCount)
    //   const price = await connectedContract.getPrice();
    //   const al = await connectedContract.checkAllowList('0x4Ead8bf030fd5575Fe978A5040ed82434e059691')
        // console.log( ethers.utils.formatUnits(al,0))

    },
    async updateURI() {

    },
    withdraw(){
        const provider = this.$provider();
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, signer);

        connectedContract.withdraw()
    },
    async updateAllowList() {
      console.log('Allow')
        try {
            const provider = this.$provider();
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, signer);

            try {
              const tx = await connectedContract.setAllowList(['0x4Ead8bf030fd5575Fe978A5040ed82434e059691'])
              console.log(tx)

            } catch (error) {
              console.log("Error MINTINIG", error);
            }
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
                  77,
                  ethers.utils.parseEther('0.07'),
                  ethers.utils.parseEther('0.001')
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

            const tx = await connectedContract.updateMerchItem(
                    0, 
                    100,
                    ethers.utils.parseEther('0.05'),
                    ethers.utils.parseEther('0.001'),
                    false,
                    true,
                    true );
            console.log(tx)

        } catch (error) {
          console.log(error)
        }
     },
  },

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
     
}
.interface {
    
    padding: 1rem;
    font-family: 'Courier New', Courier, monospace;
    display: flex;
    flex-direction: row;
}
.data {
    border:  1px dotted #000;
    padding: 1rem;
    position: relative;
}
.options {
    border:  1px dotted #000;
    display: flex;
    flex-direction: column;
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


