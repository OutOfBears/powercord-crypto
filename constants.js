module.exports = Object.freeze({
    formatCurrency: (n, p) => {
        p = typeof p === 'number' ? p : 2;
        return n.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: p,
            maximumFractionDigits: p
        })
    },

    calcPercentage: (oldValue, newValue) => {
        const n = Math.min(oldValue, newValue);
        const d = Math.max(oldValue, newValue);
        return {
            p: n / d,
            d: oldValue > newValue
        }
    },

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
  