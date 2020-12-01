const fs = require('fs');
const path = require('path');
let blobCache = {};

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

    getImgSrc: (iconPath) => {
        if(blobCache[iconPath])
            return blobCache[iconPath];

        // incase the file does not exist
        try {
            let newPath = path.join(__dirname, iconPath);
            let blob = Uint8Array.from(fs.readFileSync(newPath));
            blob = URL.createObjectURL(new Blob([blob], { type: 'image/png' }));
            blobCache[iconPath] = blob;
            return blob;
        } catch {
            return "";
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
            icon: "icons/Bitcoin.png",
            name: "Bitcoin"
        }, 
        "ETH-USD": {
            icon: "icons/Ethereum.png",
            name: "Ether",
        },
        "XRP-USD": {
            icon: "icons/Ripple.png", 
            name:"Ripple",
            precision: 4
        }
    }),
    
  });
  