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
        const d = oldValue > newValue;
        const n = d ? (oldValue - newValue) : (newValue - oldValue); 

        return {
            p: n / oldValue,
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
            icon: "https://i.imgur.com/sVnriJx.png", //"icons/Bitcon.png",
            name: "Bitcoin"
        }, 
        "ETH-USD": {
            icon: "https://i.imgur.com/ZrtZJ0f.png", //"icons/Ethereum.png",
            name: "Ether",
        },
        "XRP-USD": {
            icon: "https://i.imgur.com/8WDy4mZ.png", //"icons/Ripple.png",
            name:"Ripple",
            precision: 4
        }
    }),
    
  });
  