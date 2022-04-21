import 'dotenv/config';
const { createClient } =  require('@supabase/supabase-js')

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

exports.handler = async (event, context, callback) => {
  const address = event.queryStringParameters.address

  const addToRaffleList = await supabase
      .from('raffle_list')
      .insert({
        screen_name: address.substring(0, 8),  
        address: address,
      })
    
    if(addToRaffleList.data) {
      const id = addToRaffleList.data[0].id;
      return {
        statusCode: 200,
        body: JSON.stringify({
          list: 'raffle',
          'raffleId': id,
          t: 'a',
          screenName: address.substring(0, 8)
        })
      }
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({
          list: false,
        })
      }
    }
}
