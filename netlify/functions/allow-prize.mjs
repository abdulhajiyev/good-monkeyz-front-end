import 'dotenv/config';
const { createClient } =  require('@supabase/supabase-js')
import { ethers } from 'ethers';

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
  PRIVATE_KEY_DEV6,
  // PRIVATE_KEY_MONKEY_PROD,
} = process.env;

import { 
  INFURA_PROJECT_ID,
  NETWORK_NAME,
  MONKEY_CONTRACT,
  MERCH_DROP_CONTRACT,
  TOKEN_ID_BOOSTER_PACK,
  TOKEN_ID_OG_BADGE,
  TOKEN_ID_MYSTERY_BOX
} from '@/utils/constants';

import GMSHOPJSON from '@/utils/nftShop.json';

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

const overrides = {gasPrice: ethers.utils.parseUnits('55', 'gwei'), gasLimit: 100000};

const getTx = (hash) => new Promise((resolve, reject) => {
    const provider = new ethers.providers.InfuraProvider(NETWORK_NAME, INFURA_PROJECT_ID);
    const interval = setInterval( async () => {
        receipt = await provider.getTransactionReceipt(hash)
        if (receipt) {
            clearInterval(interval);
            resolve(receipt);
        }
    }, 400)
  });

const sendPrizes = async (prizes, to) => {
  if(prizes.length <= 0) return false

  const provider = new ethers.providers.InfuraProvider(NETWORK_NAME, INFURA_PROJECT_ID);  
  const MONKEY_KING = new ethers.Wallet(PRIVATE_KEY_DEV6, provider);
  const merchContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, MONKEY_KING);

  const prizesCount = new Array(prizes.length).fill(1)
  
  console.log('PRIZES!', prizes, prizesCount)
  let tx;

  try {
    tx = await merchContract.safeBatchTransferFrom(MONKEY_KING.address, to, prizes, prizesCount, '0x', overrides)
    return tx.hash
  } catch (error){
    const og = await supabase
      .from('failed_prizes')
      .insert({ 
          to,
          prizes
      })
    return 'transaction-failed'
  }
}

async function getPrizes(tokenIds) {
  const prizes = await Promise.all(tokenIds.map( async el => {
      return await supabase
        .from('prize_list')
        .update({ claimed: true })
        .eq('id', el)
        .is('claimed', false)
        .single()
  }))
  console.log('PRIZES', prizes)
  if (prizes.some( x => x.error )) return false
  return prizes.map(x => x.data.prize ).filter( x => x != null)
}
async function ogBadgePrize(address, burnEvent) {
  const exist = await supabase
    .from('gm-og')
    .select()
    .ilike('address', address)
    .limit(1)
    .single()

  if(exist.data) return false

  const og = await supabase
    .from('gm-og')
    .insert({ 
        address: address,
    })
  
    console.log(burnEvent)
  if (!og.error && og.data[0].id <= 670 || !og.error && burnEvent){
    return true
  } else {
    return false
  }

}

async function getTokenIds(receipt) {
  const abi = [ 
    "event GMMinted(address _address, uint256 _id, uint256 _amount)",
    "event GmBurned(address _address, uint256 _id)"];
  const iface = new ethers.utils.Interface(abi);

  let events = [];

  receipt.logs.forEach( x =>  {
    try {
      const log = iface.parseLog(x)
      if (log) events.push(log)
    } catch (error) {
      // console.log(error)
    }
  })
  const mintEvent = events.filter(x => x.name === 'GMMinted')[0]
  const ids = [] 
  const id = parseInt(ethers.utils.formatUnits(mintEvent.args[1],0))
  const amount = parseInt(ethers.utils.formatUnits(mintEvent.args[2],0))

  for(let i=0; i < amount; i++) {
    ids.push(id+i)
  }
  
  console.log('IDS: ', ids)
  return ids
}

async function checkForBurnTx(receipt) {
  const abi = [ 
    "event GMMinted(address _address, uint256 _id, uint256 _amount)",
    "event GmBurned(address _address, uint256 _id)"];
  const iface = new ethers.utils.Interface(abi);

  let events = [];

  receipt.logs.forEach( x =>  {
    try {
      const log = iface.parseLog(x)
      if (log) events.push(log)
    } catch (error) {
      // console.log(error)
    }
  })
  const burnEvent = events.filter(x => x.name === 'GmBurned')[0]

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

const returnFail = () => {
  return {
    statusCode: 200,
    body: JSON.stringify({success: false})
  }
}

exports.handler = async (event, context, callback) => {
    const body = JSON.parse(event.body);
    const tx = body.txHash;
    let prizes = [];
    console.log(body)
    
    const receipt = await getTx(tx)
    const MINTER_ADDRESS = receipt.from;

    if (receipt.to !== MONKEY_CONTRACT) {
      return returnFail()
    }

    const tokenIds = await getTokenIds(receipt)
    const burnEvent = await checkForBurnTx(receipt);

    console.log('tokenis', tokenIds)
    const tokenCount = tokenIds.length || 0

    const specialPrizes = await getPrizes(tokenIds)
    console.log('p EM',specialPrizes)
    if (specialPrizes) {
      prizes = prizes.concat(specialPrizes)
    }
    
    const ogPrize = await ogBadgePrize(MINTER_ADDRESS,burnEvent)
    if(tokenCount >= 2 && ogPrize || burnEvent && ogPrize){
      prizes.push(3)
    }
    console.log('PRIZES: ',  prizes)

    const txHash = await sendPrizes(prizes, MINTER_ADDRESS);
    console.log(txHash)
    if (txHash) {
      return {
        statusCode: 200,
        body: JSON.stringify({success: true, prizes, txHash })
      }
    } else {
      return returnFail()
    }
}
