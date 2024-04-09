const donationsRouter = require('express').Router();
const {
  getDonations,
  addDonation,
  donationStats,
} = require('../controllers/donation');

donationsRouter.get('/', getDonations);
donationsRouter.post('/add', addDonation);
donationsRouter.get('/stats', donationStats);

module.exports = donationsRouter;
