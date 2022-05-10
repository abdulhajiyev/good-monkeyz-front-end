import 'dotenv/config';
const { createClient } =  require('@supabase/supabase-js')

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

exports.handler = async (event, context, callback) => {
    const body = JSON.parse(event.body);

    const insertRef = await supabase
        .from('ref_mint')
        .insert({ 
            ref: body.ref,
            minter: body.minter,
            count: body.amount,
        })
    
    if (insertRef.data) {
        return {
            statusCode: 200,
            body: JSON.stringify({success: true, data: body.ref})
        }   
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify({success: false})
        }   
    }
}
