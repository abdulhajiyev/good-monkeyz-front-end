import 'dotenv/config';
const { schedule } = require('@netlify/functions')
const { Client, Intents } = require('discord.js');
const { createClient } =  require('@supabase/supabase-js')

const {
    DISCORD_TOKEN,
    DATABASE_URL,
    SUPABASE_SERVICE_API_KEY
} = process.env;

const SERVER = '929466540636635206'
const ONLINE = '954121587639070720'
const ALLOW = '954121838122901554'

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

const intents = new Intents([
    Intents.FLAGS.GUILDS,
    "GUILD_MEMBERS", 
    "GUILD_PRESENCES"
  ]);
  
const client = new Client({intents});

const handler = async function(event, context) {
    console.log('RUN SCHEDULED FUNCTION')
    client.on('ready', async () => {
        const guild = client.guilds.cache.get(SERVER)
        const C_ONLINE = guild.channels.cache.find(channel => channel.id === ONLINE)
        const C_ALLOW = guild.channels.cache.find(channel => channel.id === ALLOW)

        // ONLINE
        C_ONLINE.setName(`Discord: ${guild.memberCount.toLocaleString()}`)   
        // ALLOW LIST 
        const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

        const {data, error} = await supabase
            .from('allow_list')
            .select()

        const allowListMembers =  data.length;
        C_ALLOW.setName(`AllowList: ${allowListMembers}`)
    });
    client.login(DISCORD_TOKEN)

    return {
        statusCode: 200,
    };
};

module.exports.handler = schedule('2 * * * *', handler);