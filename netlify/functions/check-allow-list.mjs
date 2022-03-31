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

  const allowList = await supabase
    .from('allow_list')
    .select()
    .ilike('address', address)
    .limit(1)
    .single()

  const raffleList = await supabase
    .from('raffle_list')
    .select()
    .ilike('address', address)
    .limit(1)
    .single()
  let res;
  if (allowList.data) {
    res =  {
      list: 'allow',
      screenName: allowList.data.screen_name,
    }
  }
  if (raffleList.data) {
    res =  {
      list: 'raffle',
      screenName: raffleList.data.screen_name,
      raffleId: raffleList.data.id || null
    }
  }
  if (res) {
    return {
      statusCode: 200,
      body: JSON.stringify(res)
    }
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({list: false})
    }
  }
}
