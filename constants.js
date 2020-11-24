module.exports = Object.freeze({
    formatCurrency: (n, p) => n.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: typeof p === 'number' ? p : 2
    }),

    FluxActions: {
        UPDATE_CRYPTO_LOADING: 'CRYPTO_UPDATE_CRYPTO_LOADING',
        UPDATE_CRYPTO_PRICE: 'CRYPTO_UPDATE_CRYPTO_PRICE',
        SELECT_CRYPTO_SPAN: 'CRYPTO_SELECT_CRYPTO_SPAN',
        SELECT_CRYPTO: 'CRYPTO_SELECT_CRYPTO'
    },

    CRYPTO_DEBUG: false,
    CRYPTO_CHANNELS: Object.freeze({
        "BTC-USD": {
            icon: "https://media.yiff.gg/SlfCxb.png",
            name: "Bitcoin"
        }, 
        "XRP-USD": {
            icon: "https://media.yiff.gg/RnfLal.png",
            name:"Ripple",
            precision: 4
        }
    }),
    
  });
  