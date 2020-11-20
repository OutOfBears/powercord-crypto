const {
  Flux,
  FluxDispatcher
} = require('powercord/webpack');
const {
  FluxActions,
  CRYPTO_CHANNELS
} = require('../constants');
const cryptoCurrencies = Object.keys(CRYPTO_CHANNELS);


let currentCryptoSpan = '1m';
let currentCrypto = cryptoCurrencies[1];
let cryptoState = {
  loading: true,
  prices: cryptoCurrencies.reduce((a, x) => ({
    ...a,
    [x]: 0
  }), {}),
  pricesOverTime: cryptoCurrencies.reduce((a, x) => ({
    ...a,
    [x]: [
      {
        span: '1m',
        spanInMins: 1,
        price: 0,
        time: new Date()
      },
      {
        span: '5m',
        spanInMins: 5,
        price: 0,
        time: new Date()
      },
      {
        span: '15m',
        spanInMins: 15,
        price: 0,
        time: new Date()
      },
      {
        span: '1h',
        spanInMins: 60,
        price: 0,
        time: new Date()
      },
      {
        span: '6h',
        spanInMins: 60 * 6,
        price: 0,
        time: new Date()
      },
      {
        span: '1d',
        spanInMins: 60 * 24,
        price: 0,
        time: new Date()
      },
    ]
  }), {})
}

function handlePriceUpdate(crypto, price, time) {
  if(cryptoCurrencies.findIndex(x => x === crypto) < 0)
    return;

  cryptoState.prices[crypto] = price;

  // this is not a good way of doing this, todo: refactor.
  let pricesOverTime = cryptoState.pricesOverTime[crypto];
  for(let i in pricesOverTime) {
    let currentTime = new Date(time);
    let currentSpan = pricesOverTime[i];
    if(currentSpan === 0 || 
      new Date(currentSpan.time.getTime() + currentSpan.spanInMins * 60000) <= currentTime) {
      currentSpan.time = currentTime;
      currentSpan.price = price;
    }
  }
}

function handleSelectCrypto(crypto) {
  currentCrypto = crypto;
}

function handleSelectCryptoSpan(cryptoSpan) {
  currentCryptoSpan = cryptoSpan;
}

function handleCryptoLoading(loading) {
  cryptoState.loading = loading;
}

// store actions
class CryptoStore extends Flux.Store {
  get currentCrypto() {
    return currentCrypto;
  }

  get currentCryptoSpan() {
    return currentCryptoSpan;
  }

  get storeLoading() {
    return cryptoState.loading;
  }

  getStore() {
    return {
      currentCryptoSpan,
      currentCrypto,
      cryptoState
    };
  }

  getCryptoState() {
    return cryptoState;
  }
}

// register with fluxx
module.exports = new CryptoStore(FluxDispatcher, {
  [FluxActions.UPDATE_CRYPTO_PRICE]: ({
    crypto,
    price,
    time
  }) => handlePriceUpdate(crypto, price, time),
  [FluxActions.UPDATE_CRYPTO_LOADING]: ({ 
    loading
   }) => handleCryptoLoading(loading),
  [FluxActions.SELECT_CRYPTO]: ({
    crypto
  }) => handleSelectCrypto(crypto),
  [FluxActions.SELECT_CRYPTO_SPAN]: ({ 
    cryptoSpan
  }) => handleSelectCryptoSpan(cryptoSpan),
});