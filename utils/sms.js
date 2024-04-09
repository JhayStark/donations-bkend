const axios = require('axios');

const sendSMS = async (number, message) => {
  // console.log(process.env.SMS_API_USERNAME, process.env.SMS_API_PASSWORD);
  try {
    const response = await axios.get(
      `https://sms.nalosolutions.com/smsbackend/clientapi/Resl_Nalo/send-message/?username=${process.env.SMS_API_USERNAME}&password=${process.env.SMS_API_PASSWORD}&type=0&destination=${number}&dlr=1&source=Tenkorangs&message=${message}`
    );
    return response.data;
  } catch (error) {
    throw new Error('Error sending SMS');
  }
};

module.exports = { sendSMS };
