const express = require('express');
const { body, validationResult } = require('express-validator');
const { sendEmailWithAttachments } = require('./email');
const fs = require('fs');

const router = express.Router();

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {

    // console.log('req', req.body);
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(422).json({ errors: errors.array() });
  };
};

// Route for sending email
router.post(
  '/send-email',
  [
    // Validation rules
    // body('to').notEmpty().isEmail().withMessage('Valid email address is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('text').notEmpty().withMessage('Message text is required'),
  ],
  validate([
    // No need to repeat the validation rules here
  ]),
  async (req, res) => {
    try {
      const { to, subject, text, attachments, htmlContent } = req.body;

      
      const processedAttachments = [];
      for (const attachment of attachments) {
        const { filename, content } = attachment;
  
        // Decode the base64-encoded content
        const decodedContent = Buffer.from(content, 'base64');
  
        // Save the attachment as a file
        const attachmentPath = `files/${filename}`;
        fs.writeFileSync(attachmentPath, decodedContent);
  
        // Add the attachment to the processed attachments array
        processedAttachments.push(attachmentPath);
      }

      
      const messageId = await sendEmailWithAttachments(to, subject, text, attachments, htmlContent);

      res.json({ success: true, messageId: messageId, message: 'Email sent successfully!' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Error sending email' });
    }
  }
);

router.post('/send-sms', (req, res) => {
    const { to, body } = req.body;
  
    sendSMS(to, body);
  
    res.send('SMS sent successfully!');
});
module.exports = router;
