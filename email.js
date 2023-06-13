const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function sendEmailWithAttachments(to, subject, text, attachments, htmlContent) {
  const data = new FormData();
  data.append('from', 'noreply@europassistance.in');
  data.append('to', to);
  data.append('subject', subject);
  data.append('text', text);
  data.append('htmlContent', htmlContent);
  
  attachments.forEach((attachment) => {
    data.append('attachment', fs.createReadStream(attachment));
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://xx423.api.infobip.com/email/2/send',
    headers: { 
      'Content-Type': 'multipart/form-data,', 
      'Accept': 'application/json', 
      'Authorization': 'App 2bcb5abb3b69dfa63b43bd9b80fefda0-00711b61-5965-403d-8aae-4e08aae110ad', 
      ...data.getHeaders()
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    const messageId = response.data.messages[0].messageId; // Retrieve the message ID from the response
    
    console.log(messageId);
    console.log(JSON.stringify(response.data));
    return messageId;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { sendEmailWithAttachments };
