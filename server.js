const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App is runing on ${port}`);
});

const DB = process.env.DB_STRING.replace('<PASSWORD>', process.env.DB_PASS);
mongoose.connect(DB).then(() => {
  console.log('Data Base connection successfull');
});
