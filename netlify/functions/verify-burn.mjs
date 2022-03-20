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
    // const provider = new ethers.providers.InfuraProvider('rinkeby', 'b79b2af3b60447c8b444158b3ebe21eb');
    // console.log('VERIFY', provider)
    const body = JSON.parse(event.body);
    const message = body.message;
    const signedMessage = body.signedMessage;
    const burnTxHash = body.txHash;

    const signerAddress = ethers.utils.verifyMessage(message, signedMessage);
    const addressFromMessage = message.replace(/\n|\r/g, "").split("Wallet address:").pop().trim()
    console.log(signerAddress)
    console.log(addressFromMessage)
    
    let receipt = await getTx(burnTxHash)
    receipt = receipt
    const abi = [ "event GmBurned(address _address, uint256 _id)" ];
    const iface = new ethers.utils.Interface(abi);
    const log = iface.parseLog(receipt.logs[1]); 
    const ad = log.args[0] //ad
    const id = log.args[1] //id
    const name = log.name // event name

    
    console.log(ad)
    console.log('id: ', id)
    console.log('FUNC: ', name)

    console.log(signerAddress.toLowerCase())
    console.log(signerAddress.toLowerCase())
    console.log(signerAddress.toLowerCase())
    if(signerAddress.toLowerCase() === addressFromMessage.toLowerCase() && signerAddress.toLowerCase() === addressFromMessage.toLowerCase()){
      console.log('match')
    } else {
      console.log('no match')
      return {
        statusCode: 200,
        body: JSON.stringify({success: false})
      }
    }

  return {
    statusCode: 200,
    body: JSON.stringify({success: true})
  }
}
