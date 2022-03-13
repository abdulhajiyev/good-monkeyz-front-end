import 'dotenv/config';
const { createClient } =  require('@supabase/supabase-js')

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

exports.handler = async (event, context, callback) => {
  const {data, error} = await supabase
    .from('merch_allow_list')
    .select()

  return {
    statusCode: 200,
    body: JSON.stringify({data})
  }
}
