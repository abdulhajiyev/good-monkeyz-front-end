import 'dotenv/config';
const { createClient } =  require('@supabase/supabase-js')

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

exports.handler = async (event, context, callback) => {
console.log(event.queryStringParameters)
  const address = event.queryStringParameters.address
  console.log('address: ', address)

  const {data, error} = await supabase
    .from('merch_allow_list')
    .select()
    .ilike('address', address)
    .limit(1)
    .single()

  return {
    statusCode: 200,
    body: JSON.stringify({data})
  }
}
