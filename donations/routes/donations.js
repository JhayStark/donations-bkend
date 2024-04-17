const donationsRouter = require('express').Router();
const {
  getDonations,
  addDonation,
  donationStats,
  bulkSms,
  getDonation,
  editDonations,
  // updateDocumentsWithTimeStampsAndDeletedStatus,
} = require('../controllers/donation');

donationsRouter.get('/', getDonations);
donationsRouter.post('/add', addDonation);
donationsRouter.get('/stats', donationStats);
donationsRouter.post('/send-sms', bulkSms);
donationsRouter.get('/single/:id', getDonation);
donationsRouter.patch('/:id', editDonations);
// donationsRouter.patch(
//   '/updateDocs/:id',
//   updateDocumentsWithTimeStampsAndDeletedStatus
// );

module.exports = donationsRouter;
