import 'dotenv/config';
const { createClient } =  require('@supabase/supabase-js')
const { TwitterApi } = require('twitter-api-v2')
import { ethers } from 'ethers';

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
  CONSUMER_KEY,
  CONSUMER_SECRET,
  RETURN_URL,
  PRIVATE_KEY_DEV
  // PRIVATE_KEY_MONKEY_PROD,
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
    .from('allow_list')
    .select()
    .ilike('screen_name', TWITTER_SCREEN_NAME)
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

  if(allowList.data.signature) {
    return {
      statusCode: 302,
      headers: {
        Location: `${RETURN_URL}?verify=false&msg=used`,
        'Cache-Control': 'no-cache' 
      },
      body: ''
    }
  }
  if (allowList.data.screen_name.toLowerCase() === TWITTER_SCREEN_NAME.toLowerCase()) {

    const MONKEY_KING = new ethers.Wallet(PRIVATE_KEY_DEV);
    const messageHash = ethers.utils.solidityKeccak256(['address', 'uint256'], [OAuthStep1.data.address, 0]);
    const messageBytes = ethers.utils.arrayify(messageHash);
    const signature = await MONKEY_KING.signMessage(messageBytes);

    const updatedEthAddress = await supabase
      .from('allow_list')
      .update({ 
        address: OAuthStep1.data.address,
        signature: signature,
       })
      .ilike('screen_name', TWITTER_SCREEN_NAME)

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
