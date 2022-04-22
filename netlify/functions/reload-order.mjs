import 'dotenv/config';
const { createClient } =  require('@supabase/supabase-js')
import { ethers } from 'ethers';

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
} = process.env;

import { 
  INFURA_PROJECT_ID,
  NETWORK_NAME,
} from '@/utils/constants';

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

const getTx = (hash) => new Promise((resolve, reject) => {
  const provider = new ethers.providers.AlchemyProvider(NETWORK_NAME, ALCHEMY_API);;
  const interval = setInterval( async () => {
      receipt = await provider.getTransactionReceipt(hash)
      if (receipt) {
          clearInterval(interval);
          resolve(receipt);
      }
  }, 1000)
});

exports.handler = async (event, context, callback) => {

  const address = event.queryStringParameters.address

  const unverifiedOrder = await supabase
    .from('merch_orders')
    .select()
    .is('verified', false)
    .not('txHash', 'eq', '')
    .ilike('address', address)
    .limit(1)
    .single()
  
  const verifiedOrder = await supabase
    .from('merch_orders')
    .select()
    .is('verified', true)
    .ilike('address', address)
    .order('id', { ascending: false })
    .limit(1)
    .single()

    console.log(unverifiedOrder.data, verifiedOrder.data)

  if (unverifiedOrder.data) {
      console.log('ORDER FOUND-needs reload')
    let receipt = await getTx(unverifiedOrder.data.txHash)
    receipt = receipt
    const abi = [ "event GmBurned(address _address, uint256 _id)" ];
    const iface = new ethers.utils.Interface(abi);
    const log = iface.parseLog(receipt.logs[1]); 
    const addressFromEvent = log.args[0] 
    const id = log.args[1]
    const name = log.name
    if(name !== 'GmBurned' && id !== 0) {
      return {
        statusCode: 500,
        body: JSON.stringify({success: false})
      }
    }
    

    if(address.toLowerCase() === addressFromEvent.toLowerCase()){
      console.log('match')

      const verifiedOrder = await supabase
        .from('merch_orders')
        .update({ 
            verified: true
        })
        .ilike('address', address)
        .limit(1)
        .single()

      if(verifiedOrder.data){
        console.log('database update', verifiedOrder.data)
        return {
          statusCode: 200,
          body: JSON.stringify(
            {
              order: true,
              orderNumber: verifiedOrder.data.id
            })
        }
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify({order: 'pending'})
    }
  }
  if (verifiedOrder.data) {
    return{
      statusCode: 200,
      body: JSON.stringify({order: true, id: verifiedOrder.data.id})
    }
  }
  return {
      statusCode: 200,
      body: JSON.stringify({order: false})
  }   
}
