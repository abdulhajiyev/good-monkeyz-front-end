import 'dotenv/config'; 
const { createClient } = require('@supabase/supabase-js')
const { TwitterApi } = require('twitter-api-v2')

const {
    DATABASE_URL,
    SUPABASE_SERVICE_API_KEY,
    CONSUMER_KEY,
    CONSUMER_SECRET,
    CALLBACK_URL,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

exports.handler = async (event, context) => {
  const client = new TwitterApi({ appKey: CONSUMER_KEY, appSecret: CONSUMER_SECRET });
    
  const auth = await client.generateAuthLink(CALLBACK_URL)

  const ethAddress = event.queryStringParameters.address.toLowerCase()

  const { data, error } = await supabase
      .from('Token')
      .insert([
          { 
            token: auth.oauth_token,
            secret: auth.oauth_token_secret,
            address: ethAddress
          },
      ]);
  
  return {
    statusCode: 302,
    headers: {
      Location: auth.url,
      'Cache-Control': 'no-cache' 
    },
    body: ''
  }
}
