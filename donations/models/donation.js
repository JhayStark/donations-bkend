const { Schema, model } = require('mongoose');

const donationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  recipientType: {
    type: String,
  },
  recipientName: {
    type: String,
  },
});

module.exports = model('Donation', donationSchema);
