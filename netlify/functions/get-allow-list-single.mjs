import 'dotenv/config';
const { createClient } =  require('@supabase/supabase-js')

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
  ALLOW_LIST_DB_NAME,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

exports.handler = async (event, context, callback) => {
console.log(event.queryStringParameters)
  const address = event.queryStringParameters.address

  const allowList = await supabase
    .from(ALLOW_LIST_DB_NAME)
    .select()
    .ilike('address', address)
    .limit(1)
    .single()

  if (allowList.data) {
    return {
      statusCode: 200,
      body: JSON.stringify(allowList.data)
    }
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({list: false})
    }
  }
}
