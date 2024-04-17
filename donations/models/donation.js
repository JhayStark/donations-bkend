const { Schema, model } = require('mongoose');

const donationSchema = new Schema(
  {
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
    deleted: {
      type: Boolean,
      default: false,
    },
    createdOn: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = model('Donation', donationSchema);
