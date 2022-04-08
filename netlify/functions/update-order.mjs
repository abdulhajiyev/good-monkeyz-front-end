import 'dotenv/config';
const { createClient } =  require('@supabase/supabase-js')
import { ethers } from 'ethers';

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

exports.handler = async (event, context, callback) => {
    const body = JSON.parse(event.body);
    const message = body.message;
    const signedMessage = body.signedMessage;
    const signerAddress = ethers.utils.verifyMessage(message, signedMessage);
    const txHash = body.txHash;

    const updateOrder = await supabase
        .from('merch_orders')
        .update(
            {
                txHash: txHash
            })
        .ilike('address', signerAddress)
        .limit(1)
        .single()

    if (updateOrder.data) {
        return {
            statusCode: 200,
            body: JSON.stringify({success: true})
        }   
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify({success: false})
        }   
    }

}
