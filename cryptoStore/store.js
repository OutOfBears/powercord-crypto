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
    [x]: {price: 0, last24Price: 0, low24Price: 0, high24Price: 0}
  }), {})
}

function handlePriceUpdate(tickerMessage) {
  console.log("update", tickerMessage);

  const crypto = tickerMessage.product_id;

  if(cryptoCurrencies.findIndex(x => x === crypto) < 0)
    return;

  cryptoState.prices[crypto] = {
    price: Number(tickerMessage.price),
    last24Price: Number(tickerMessage.open_24h),
    low24Price: Number(tickerMessage.low_24h),
    high24Price: Number(tickerMessage.high_24h)
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
    tickerMessage
  }) => handlePriceUpdate(tickerMessage),
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