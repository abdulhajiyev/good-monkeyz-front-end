import 'dotenv/config';
const { createClient } =  require('@supabase/supabase-js')
import { ethers } from 'ethers';

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
} = process.env;

import { 
  ALCHEMY_API,
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
    const body = JSON.parse(event.body);
    const message = body.message;
    const signedMessage = body.signedMessage;
    const burnTxHash = body.txHash;
    console.log(body)
    
    const signerAddress = ethers.utils.verifyMessage(message, signedMessage);
    const addressFromMessage = message.replace(/\n|\r/g, "").split("Wallet address:").pop().trim()
    console.log(signerAddress)
    console.log(addressFromMessage)
    
    let receipt = await getTx(burnTxHash)
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
    
    console.log(signerAddress.toLowerCase())
    console.log(addressFromMessage.toLowerCase())
    console.log(addressFromEvent.toLowerCase())

    if(signerAddress.toLowerCase() === addressFromMessage.toLowerCase() && signerAddress.toLowerCase() === addressFromEvent.toLowerCase()){
      console.log('match')

      const verifiedOrder = await supabase
        .from('merch_orders')
        .update({ 
            verified: true
        })
        .ilike('address', signerAddress)
        .limit(1)
        .single()

      if(verifiedOrder.data){
        console.log('database update', verifiedOrder.data)
        return {
          statusCode: 200,
          body: JSON.stringify(
            {
              success: true,
              orderNumber: verifiedOrder.data.id
            })
        }
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({success: false})
    }
}
