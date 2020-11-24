const { FluxDispatcher } = require('powercord/webpack');
const { FluxActions } = require('../constants');

module.exports = {
  selectCrypto: (crypto) => {
    FluxDispatcher.dirtyDispatch({
        type: FluxActions.SELECT_CRYPTO,
        crypto
    });
  },

  selectCryptoSpan: (cryptoSpan) => {
    FluxDispatcher.dirtyDispatch({
        type: FluxActions.SELECT_CRYPTO_SPAN,
        cryptoSpan
    });
  },

  updateCryptoLoading: (loading) => {
    FluxDispatcher.dirtyDispatch({
      type: FluxActions.UPDATE_CRYPTO_LOADING,
      loading
    });
  },

  updateCryptoPrice: (tickerMessage) => {
    FluxDispatcher.dirtyDispatch({
        type: FluxActions.UPDATE_CRYPTO_PRICE,
        tickerMessage
    });
  }
};
