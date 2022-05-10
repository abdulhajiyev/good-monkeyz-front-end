import 'dotenv/config';
const { createClient } =  require('@supabase/supabase-js')
import { ethers } from 'ethers';

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
  // PRIVATE_KEY_DEV6,
  PRIVATE_KEY_MONKEY_PROD,
} = process.env;

import { 
  ALCHEMY_API,
  INFURA_PROJECT_ID,
  NETWORK_NAME,
  MONKEY_CONTRACT,
  MERCH_DROP_CONTRACT,
  TOKEN_ID_BOOSTER_PACK,
  TOKEN_ID_OG_BADGE,
  TOKEN_ID_MYSTERY_BOX
} from '@/utils/constants';

import FMPFP from '@/utils/GoodMonkeyz.json';
import GMSHOPJSON from '@/utils/nftShop.json';

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

const overrides = {gasPrice: ethers.utils.parseUnits('60', 'gwei'), gasLimit: 100000};

const getTx = (hash) => new Promise((resolve, reject) => {
    const provider = new ethers.providers.AlchemyProvider(NETWORK_NAME, ALCHEMY_API);
    const interval = setInterval( async () => {
        receipt = await provider.getTransactionReceipt(hash)
        if (receipt) {
            clearInterval(interval);
            resolve(receipt);
        }
    }, 400)
  });


  async function getTokenIds(receipt) {
    const abi = [ 
      "event GMMinted(address _address, uint256 _id, uint256 _amount)",
      "event GmBurned(address _address, uint256 _id)",
      "event TransferSingle(address indexed operator,address indexed from, address indexed to, uint256 id, uint256 value)",
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
    ];
    const iface = new ethers.utils.Interface(abi);
    
    return receipt.logs
      .map(log => iface.parseLog(log))
      .filter(log => log.name === 'Transfer')
      .map( transfer => ethers.utils.formatUnits(transfer.args[2],0) )
  }

  async function getTokenTransferAddress(receipt) {
    const abi = [ 
      "event GMMinted(address _address, uint256 _id, uint256 _amount)",
      "event GmBurned(address _address, uint256 _id)",
      "event TransferSingle(address indexed operator,address indexed from, address indexed to, uint256 id, uint256 value)",
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
    ];
    const iface = new ethers.utils.Interface(abi);
    
    return receipt.logs
      .map(log => iface.parseLog(log))
      .filter(log => log.name === 'Transfer')
      .map( transfer => transfer.args[1] )
  }
  
  async function checkOwner(ids) {
    const provider = new ethers.providers.AlchemyProvider(NETWORK_NAME, ALCHEMY_API);
    const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, FMPFP.abi, provider);
  
    return await Promise.all(ids.map(id => monkeyContract.ownerOf(id)));
  }

async function checkForBurnTx(receipt) {
  const abi = [ 
    "event GMMinted(address _address, uint256 _id, uint256 _amount)",
    "event GmBurned(address _address, uint256 _id)",
    "event TransferSingle(address indexed operator,address indexed from, address indexed to, uint256 id, uint256 value)",
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
  ];
  const iface = new ethers.utils.Interface(abi);
  
  const burnEvent = receipt.logs
    .map(log => iface.parseLog(log))
    .filter(log => log.name === 'GmBurned')[0]

  if (burnEvent) {
    const address = burnEvent.args[0]
    const id = ethers.utils.formatUnits(burnEvent.args[1],0)
  
    return {
      burned: true,
      id,
      address
    }
  } else {
    return false
  }
}

async function idToImg(id, address) {

  const {data, error} = await supabase
    .from('monkeyz')
    .update({ 
      'mintedFrom': 'booster',
      'address': address,
    })
    .eq('id', id)
    .single()


    console.log(data)
  return  data.cid
}

const returnFail = () => {
  return {
    statusCode: 200,
    body: JSON.stringify({success: false})
  }
}

exports.handler = async (event, context, callback) => {
    console.log('START REVEAL CHECK')
    const body = JSON.parse(event.body);
    const tx = body.txHash;
    const receipt = await getTx(tx)
    const MINTER_ADDRESS = receipt.from;

    if (receipt.to !== MONKEY_CONTRACT) {
      return returnFail()
    }

    const tokenIds = await getTokenIds(receipt)
    const toAddresses = await getTokenTransferAddress(receipt)
    const burnEvent = await checkForBurnTx(receipt);
    const owners = await checkOwner(tokenIds)
    const sameOwner = owners.every( (x, i, arr) => x === arr[0]) 
    const sameAddress = toAddresses.every( (x, i, arr) => x === arr[0]) 
    console.log(sameOwner, owners[0])
    console.log(sameAddress, toAddresses[0])

    if (!burnEvent || !sameOwner || MINTER_ADDRESS !== owners[0] || tokenIds.length < 3 || !sameAddress ||  toAddresses[0] !== MINTER_ADDRESS) {
        return returnFail()
    }

    const data = await Promise.all(tokenIds.map( async id => { 
        return { 
          id,
          data: await idToImg(id, MINTER_ADDRESS)
        }
      }))
    console.log(data)

    if (data) {
      return {
        statusCode: 200,
        body: JSON.stringify({success: true, data })
      }
    } else {
      return returnFail()
    }
}
