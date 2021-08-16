const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

const targetUrl = 'http://target.com';

const target = axios.create({
  baseURL: targetUrl,
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res) => {
  try {
    console.log('================ REQUEST ================');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Method:', req.method);
    console.log('Url:', req.originalUrl);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('=========================================');

    const {host, ...headers} = req.headers;

    const response = await target({
      url: req.originalUrl,
      data: req.body,
      method: req.method,
      headers,
    });

    console.log('================ RESPONSE ================');
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    console.log('Data:', response.data);
    console.log('=========================================');

    res
      .set(response.headers)
      .status(response.status)
      .send(response.data);
  } catch (error) {
    if (!error.response) {
      console.log(error);

      return res.status(500).send(error.message);
    }

    console.log('================ RESPONSE ERROR ================');
    console.log('Status:', error.response.status);
    console.log('Headers:', error.response.headers);
    console.log('Data:', error.response.data);
    console.log('=========================================');

    res
      .set(error.response.headers)
      .status(error.response.status)
      .send(error.response.data);
  }
});

app.listen(5555, () => {
  console.log(`Running on port ${5555}`);
});
