const twilio = require('twilio');
const config = require("./config");


const ACCOUNT_SID = config.twilio_sid;
const AUTH_TOKEN = config.twilio_auth;
const client = new twilio(ACCOUNT_SID, AUTH_TOKEN);

// Generate a 6-digit OTP
const OTP = Math.floor(100000 + Math.random() * 900000);

// Send the OTP to the phone number
client.messages
  .create({
    body: `Your OTP is: ${OTP}`,
    from: 'YOUR_TWILIO_PHONE_NUMBER',
    to: 'PHONE_NUMBER_TO_SEND_OTP_TO'
  })
  .then(message => console.log(`OTP sent to ${message.to}`))
  .catch(error => console.error(error));


// Verify the OTP entered by the user
client.verify.services('YOUR_VERIFY_SERVICE_SID')
  .verifications
  .create({
    to: 'PHONE_NUMBER_TO_VERIFY',
    channel: 'sms',
    code: 'ENTERED_OTP'
  })
  .then(verification => {
    if (verification.status === 'approved') {
      // OTP verified successfully
      console.log('OTP verified successfully');
    } else {
      // OTP verification failed
      console.error('OTP verification failed');
    }
  })
  .catch(error => console.error(error));