const Donation = require('../models/donation');
const { sendSMS } = require('../../utils/sms');
const { formatCurrencyToGHS } = require('../../utils/helpers');

const addDonation = async (req, res) => {
  try {
    const newDonation = await Donation.create(req.body);
    const message = `Thank you, ${
      newDonation.name
    }, for your donation of ${formatCurrencyToGHS(newDonation.amount)} to ${
      newDonation.recipientType.includes('Individual')
        ? newDonation.recipientName
        : `the ${newDonation.recipientType}`
    }.`;
    sendSMS(req.body.contact, message);
    res.status(201).json(newDonation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDonations = async (req, res) => {
  const search = req.query.search || '';
  const pageSize = parseInt(req.query.pageSize) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * pageSize;
  try {
    const aggregationPipeline = [
      {
        $match: {
          name: { $regex: search, $options: 'i' },
        },
      },
    ];
    const countResult = await Donation.aggregate([
      ...aggregationPipeline,
      { $count: 'total' },
    ]);

    const metaData = {
      page,
      pageSize,
      total: countResult[0]?.total || 0,
      totalPages: Math.ceil(countResult[0]?.total / pageSize) || 0,
    };
    const donations = await Donation.aggregate([
      ...aggregationPipeline,
      { $sort: { createdAt: -1 } },
    ])
      .skip(skip)
      .limit(pageSize);
    res.status(200).json({ ...metaData, donations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const donationStats = async (req, res) => {
  try {
    const stats = await Donation.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);
    const statsObj = stats[0] || { total: 0, count: 0 };
    res.status(200).json(statsObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { addDonation, getDonations, donationStats };
