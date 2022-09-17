## Test Assignment

### Result

Please run a command to show the result

`$ npm run start`

It will show the result like the following

```
{
  BTC: '794481639.97207 USD',
  ETH: '43730953.72336 USD',
  XRP: '11083.76940 USD'
}
```

### Approach
First, I read the csv file the get the data of tokens. Here I am using a library [csv-parse](https://www.npmjs.com/package/csv-parse) to parse the data

It reads line by line until to the end. I define a global variable `tokens`. For each line, I get transactionType, token and amount and accumulate their amount to the tokens variable.

There are 2 types of transactionType `DEPOSIT` and `WITHDRAWAL`.

- DEPOSIT: to add a value to the amount. In order to do that, I define +1 so the value will be `+ (1*increment)`
- WITHDRAWAL: to subtract a value the amount. In order to that that, I define -1 so the value will be `+ (-1*decrement)`

It does not depend on timestamp because eventually, increment first or decrement first doesn't change the final amount.

Finally, I call an API to obtain the exchange rates compared to USD, then do the division to convert the final amounts to USD.


