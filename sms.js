const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.INFOBIP_API_KEY;
const baseUrl = process.env.INFOBIP_BASE_URL;


async function sendSMS(to, body) {
    try {
      const response = await axios.post(baseUrl, {
        from: 'your-sender-id',
        to,
        text: body
      }, {
        headers: {
          'Authorization': `App ${apiKey}`
        }
      });
      console.log('SMS sent:', response.data);
    } catch (error) {
      console.error('Error sending SMS:', error.response.data);
    }
  }
  
  module.exports = { sendSMS };
  