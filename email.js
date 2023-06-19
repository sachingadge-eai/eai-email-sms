const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function sendEmailWithAttachments(to, subject, text, attachments, htmlContent) {
  // console.log('to', to);
  const data = new FormData();
  // Convert the recipients array to a comma-separated string
  const recipients = to.join(',');

  data.append('from', 'noreply@europassistance.in');
  data.append('to', recipients);
  data.append('subject', subject);
  data.append('text', text);
  data.append('htmlContent', htmlContent);
  
  // attachments.forEach((attachment) => {
  //   data.append('attachment', fs.createReadStream(attachment));
  // });

  attachments.forEach((attachment) => {
    const extension = path.extname(attachment.filename);
    const uniqueFileName = `${uuidv4()}${extension}`;
    const attachmentPath = path.join(__dirname, 'files', uniqueFileName);

    fs.writeFileSync(attachmentPath, Buffer.from(attachment.content, 'base64'));
    data.append('attachment', fs.createReadStream(attachmentPath), {
      filename: attachment.filename
    });

    // Delete the temporary file
    fs.unlinkSync(attachmentPath);
    // Delete the original file
    fs.unlinkSync(path.join(__dirname, 'files', attachment.filename));
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
