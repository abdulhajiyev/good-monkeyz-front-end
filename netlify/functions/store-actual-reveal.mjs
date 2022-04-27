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
    const monkeyz = body.monkeyz;
    const address = body.address;
    const shown = body.shown;

    const {data} = await supabase
        .from('monkeyz_shown')
        .insert({
            'address': address,
            'monkey_ids' : monkeyz,
            'shown': shown
        })

    if (data) {
      return {
        statusCode: 200,
        body: JSON.stringify({success: true })
      }
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify({success: false })
        }
    }
}
