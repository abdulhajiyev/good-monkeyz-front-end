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

  const {data, error, count} = await supabase
    .from('allow_list')
    .select("*", { count: "exact", head: true})

  console.log(count)
  return {
    statusCode: 200,
    body: JSON.stringify({count})
  }
}
