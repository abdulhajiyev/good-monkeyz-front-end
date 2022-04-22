import { ethers } from 'ethers';

import GMSHOPJSON from '@/utils/nftShop.json';

import { 
  MERCH_DROP_CONTRACT,
  INFURA_PROJECT_ID,
  NETWORK_NAME,
  TOKEN_ID_MERCH_BUNDLE 
} from '@/utils/constants';

export default async function ({ store, redirect }) {
    try {
        console.log('WALLET:', store.state.wallet)
        const provider = new ethers.providers.AlchemyProvider(NETWORK_NAME, ALCHEMY_API);;
        const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, provider);
        const balBig = await connectedContract.balanceOf(store.state.wallet, TOKEN_ID_MERCH_BUNDLE);
        const bal = ethers.utils.formatUnits(balBig, 0)

        const res = await (await fetch(`/.netlify/functions/reload-order?address=${store.state.wallet}`)).json()
        const order = res.order;

        if (bal < 1 && !order) {
            return redirect('/ngmi');
        }
    } catch(error){
          console.error(error);
        return 0;
    }
}