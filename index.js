const fs = require("fs");
const axios = require('axios');
const { parse } = require("csv-parse");

/* The result of the test assignment
tokens = {
  ETH: '1.02 USD',
  BTC: '10200 USD',
  // etc
  ...
}
*/
const tokens = { };

const TRANSACTION_TYPES = {
  DEPOSIT: 1,
  WITHDRAWAL: -1
}

const TOKEN_NAMES = {
  USD: 'USD'
}
const CRYPTO_CURRENCY_URL = 'https://min-api.cryptocompare.com/data/price';

const convertToUsd = async (tokens) => {
  const config = {
    url: CRYPTO_CURRENCY_URL,
    method: 'GET',
    params: {
      fsym: TOKEN_NAMES.USD,
      tsyms: tokens.join(',')
    }
  };
  try {
    const result = await axios.request(config);
    return result?.data;
  } catch (err) {
    console.log('ERROR: cannot call cryptocurrency api, please check')
    console.log('ERROR MESSAGE: ' + err.message);
  }
  
}

fs.createReadStream("./data/transactions.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    const [, transactionType, token, amount] = row;
    if (!tokens[token]) {
      tokens[token] = 0;
    }
    tokens[token] += parseFloat(amount) * TRANSACTION_TYPES[transactionType];
  })
  .on("end", async function () {
    const converts = await convertToUsd(Object.keys(tokens));
    const entries = Object.entries(converts);
    for (let i=0; i<entries.length; i++) {
      const [key, value] = entries[i];
      tokens[key] = (tokens[key] / value).toFixed(5) + ' USD';
    }
    console.log(tokens);
  })
  .on("error", function (error) {
    console.log(error.message);
  });
