const donationsRouter = require('express').Router();
const {
  getDonations,
  addDonation,
  donationStats,
  bulkSms,
} = require('../controllers/donation');

donationsRouter.get('/', getDonations);
donationsRouter.post('/add', addDonation);
donationsRouter.get('/stats', donationStats);
donationsRouter.post('/send-sms', bulkSms);

module.exports = donationsRouter;
