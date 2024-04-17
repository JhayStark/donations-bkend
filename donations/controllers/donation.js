const Donation = require('../models/donation');
const { sendSMS } = require('../../utils/sms');
const { formatCurrencyToGHS } = require('../../utils/helpers');
const mongoose = require('mongoose');

const addDonation = async (req, res) => {
  try {
    const newDonation = await Donation.create(req.body);
    newDonation.createdOn = newDonation._id.getTimestamp();
    await newDonation.save();
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
  const searchField = req.query.searchField || 'name';
  const pageSize = parseInt(req.query.pageSize) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * pageSize;
  const sortField = req.query.sortField || 'name';
  const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
  try {
    const aggregationPipeline = [
      {
        $match: {
          [searchField]: { $regex: search, $options: 'i' },
          deleted: false,
        },
      },
      {
        $sort: { [sortField]: sortOrder },
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
    const donations = await Donation.aggregate([...aggregationPipeline])
      .skip(skip)
      .limit(pageSize);
    res.status(200).json({ ...metaData, donations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (donation) {
      res.status(200).json(donation);
    } else {
      res.status(404).json('Donation not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editDonations = async (req, res) => {
  try {
    const updatedDonation = await Donation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedDonation) {
      res.status(200).json('updated succefully');
    } else {
      res.status(404).json('Failed to update');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const updateDocumentsWithTimeStampsAndDeletedStatus = async (req, res) => {
//   try {
//     let count = 0;
//     const donations = await Donation.find();
//     const updatePromises = donations.map(async donation => {
//       const time = donation._id.getTimestamp();
//       donation.createdOn = time;
//       donation.deleted = false;
//       count++;
//       return donation.save();
//     });
//     await Promise.all(updatePromises);
//     res.status(200).json(count);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const donationStats = async (req, res) => {
  try {
    const stats = await Donation.aggregate([
      {
        $match: {
          deleted: false,
        },
      },
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

const bulkSms = async (req, res) => {
  try {
    const { message } = req.body;

    if (message.includes('$name$')) {
      Donation.find({})
        .select('name contact')
        .then(donor => {
          donor.forEach(donor => {
            const messageBody = message.replaceAll('$name$', donor.name);
            // console.log(messageBody, 'message body');
            sendSMS(donor.contact, messageBody);
          });
        })
        .catch(err => console.log(err));
    } else {
      Donation.find({})
        .select('contact -_id')
        .then(donor => {
          const numbers = donor.map(donor => donor.contact);
          sendSMS(numbers, message);
        })
        .catch(err => err);
    }
    res.status(200).json('Messages sent');
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  addDonation,
  getDonations,
  donationStats,
  bulkSms,
  getDonation,
  editDonations,
  // updateDocumentsWithTimeStampsAndDeletedStatus,
};
