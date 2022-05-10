import 'dotenv/config';
const { createClient } =  require('@supabase/supabase-js')

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

exports.handler = async (event, context, callback) => {
    const body = JSON.parse(event.body);

    console.log(body.refAddress)
    const ref = await supabase
        .from('ref_list')
        .select('ref')
        .eq('ref_address', body.refAddress)
        .single()
    
    if (!ref.error) {
        return {
            statusCode: 200,
            body: JSON.stringify({success: true, data: ref.data})
        }   
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify({success: false})
        }   
    }
}
