const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Google Custom Search API Details
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const CSE_ID = process.env.CSE_ID;
const GOOGLE_URL = 'https://www.googleapis.com/customsearch/v1';

// Function to fetch a random Don Cheadle image from Google Custom Search
async function getRandomImage() {
  try {
    const response = await axios.get(GOOGLE_URL, {
      params: {
        key: GOOGLE_API_KEY,
        cx: CSE_ID,
        q: 'Don Cheadle',
        searchType: 'image',
        num: 10 // Fetch 60 images
      }
    });

    const images = response.data.items;
    if (!images || images.length === 0) {
      console.log('No images found!');
      return null;
    }

    const random = Math.floor(Math.random() * images.length);
    return images[random].link; // Return the link of a random image
  } catch (err) {
    console.error('Image search failed:', err.message);
    return null;
  }
}

client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.content === '!don') {
    const image = await getRandomImage();

    if (!image) {
      return message.channel.send('Sorry, I couldn\'t find an image this time 😢');
    }

    // Send the image in an embed
    message.channel.send({
      embeds: [
        {
          image: { url: image },
          color: 0x0099ff,
          footer: { text: 'Powered by Google Custom Search API' }
        }
      ]
    });
  }
});

client.login(process.env.DISCORD_TOKEN);