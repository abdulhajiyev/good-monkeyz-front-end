import 'dotenv/config';
const { createClient } =  require('@supabase/supabase-js')
import { ethers } from 'ethers';

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

const getTx = (hash) => new Promise((resolve, reject) => {
    const provider = new ethers.providers.InfuraProvider('rinkeby', 'b79b2af3b60447c8b444158b3ebe21eb');
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
    const mintTx = body.txHash;
    console.log('BODY// ', body)

    

    let receipt = await getTx(mintTx)
    // -> check tx is a succes?

    // -> mint allow abi -> 
    const abi = [ "event GmBurned(address _address, uint256 _id)" ];
    const iface = new ethers.utils.Interface(abi);
    // -> get correct event log -> 
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
    


    if(true) {
      // check database item has not been send? 
      // set pending -> 
      // 
      console.log('match')
      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            success: true,

          })
      }
      
    }

    return {
      statusCode: 500,
      body: JSON.stringify({success: false})
    }
}
