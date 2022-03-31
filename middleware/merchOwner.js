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
        const provider = new ethers.providers.InfuraProvider(NETWORK_NAME, INFURA_PROJECT_ID);
        const connectedContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, provider);
        const balBig = await connectedContract.balanceOf(store.state.wallet, TOKEN_ID_MERCH_BUNDLE);
        const bal = ethers.utils.formatUnits(balBig, 0)

        if (bal < 1) {
            return redirect('/ngmi');
        }
    } catch(error){
          console.error(error);
        return 0;
    }
}