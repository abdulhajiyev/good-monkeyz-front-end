import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from 'ethers';

import { 
    INFURA_PROJECT_ID,
    CHAIN_ID,
} from '@/utils/constants';

export default ({ app }, inject) => {
    let prov;
    inject('newWCprovider', () => { 
        prov = new ethers.providers.Web3Provider(
            new WalletConnectProvider({
                infuraId: INFURA_PROJECT_ID,
                chainId: CHAIN_ID,
            })
        )
        return prov;
    });
    inject('newMMprovider', () => { 
        prov = new ethers.providers.Web3Provider(window.ethereum);
       return prov;
    });
    inject('provider', () => { 
        console.log(prov)
       return prov;
    });
}
