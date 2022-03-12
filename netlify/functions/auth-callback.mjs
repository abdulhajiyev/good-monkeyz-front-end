import 'dotenv/config';
const { createClient } =  require('@supabase/supabase-js')
const { TwitterApi } = require('twitter-api-v2')

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
  CONSUMER_KEY,
  CONSUMER_SECRET,
  RETURN_URL,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

exports.handler = async (event, context, callback) => {
  
  const query = event.queryStringParameters
  const OAuthStep1 = await supabase
    .from('Token')
    .select('secret, address')
    .eq('token', query.oauth_token)
    .limit(1)
    .single()

  if(OAuthStep1.error) throw new Error('No OAuth Token Found')

  const client = new TwitterApi({
    appKey: CONSUMER_KEY,
    appSecret: CONSUMER_SECRET,
    accessToken: query.oauth_token,
    accessSecret: OAuthStep1.data.secret,
  });

  const userClient = await client.login(query.oauth_verifier)
  const TWITTER_SCREEN_NAME = userClient.screenName
  
  const allowList = await supabase
    .from('merch_allow_list')
    .select()
    .eq('screen_name', TWITTER_SCREEN_NAME)
    .limit(1)
    .single()

  if(allowList.data === null) {
    return {
      statusCode: 302,
      headers: {
        Location: `${RETURN_URL}?verify=${false}`,
        'Cache-Control': 'no-cache' 
      },
      body: ''
    }
  }

  let verified;

  if (allowList.data.screen_name === TWITTER_SCREEN_NAME) {
    const updatedEthAddress = await supabase
      .from('merch_allow_list')
      .update({ address: OAuthStep1.data.address })
      .eq('screen_name', TWITTER_SCREEN_NAME)

    if(updatedEthAddress.error)  throw new Error('ETH Address Not updated')
    verified = true
  } else {
    verified = false;
  }

  return {
    statusCode: 302,
    headers: {
      Location: `${RETURN_URL}?verify=${verified}&screen_name=${TWITTER_SCREEN_NAME}`,
      'Cache-Control': 'no-cache' 
    },
    body: ''
  }
}
