const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const credentials = require('./config/credentials');
const helmet = require('helmet');
const morgan = require('morgan');
const dbConnect = require('./config/dbConnect');
const { corsOptions } = require('./config/corsOptions');
const donationsRouter = require('./donations/routes/donations');

const app = express();

dotenv.config();
app.use(helmet());
app.use(morgan('dev'));
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use('/donations', donationsRouter);

(async function start() {
  await dbConnect();
  app.listen(PORT, () => {
    console.log(`Server is running on:${PORT}`);
  });
})();
