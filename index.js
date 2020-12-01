const { Plugin } = require('powercord/entities');
const { get } = require('powercord/http');
const { waitFor, getOwnerInstance, findInTree, sleep } = require('powercord/util');
const { React, getModule, getModuleByDisplayName } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { CoinbasePro, WebSocketChannelName, WebSocketEvent } = require('coinbase-pro-node');
const { CRYPTO_CHANNELS, CRYPTO_DEBUG } = require("./constants");

const cryptoStore = require('./cryptoStore/store');
const cryptoStoreActions = require('./cryptoStore/actions');

const Modal = require('./components/Modal');

module.exports = class CryptoLive extends Plugin {
  constructor () {
    super();

    this.channel = {
      name: WebSocketChannelName.TICKER,
      product_ids: Object.keys(CRYPTO_CHANNELS)
    };

    this.client = new CoinbasePro();
    this.client.ws.on(WebSocketEvent.ON_OPEN, () => this.onCoinbaseConnect());
    this.client.ws.on(WebSocketEvent.ON_MESSAGE_TICKER, (m) => this.onCoinbaseTicker(m));
  }
  
  pluginWillUnload () {
    client.ws.disconnect();
    uninject('pc-crypto-modal');
    window.TradingView = undefined; // terrible but works ig

    const { container } = getModule([ 'container', 'usernameContainer' ], false);
    const accountContainer = document.querySelector(`section > .${container}`);
    const instance = getOwnerInstance(accountContainer);
    instance.forceUpdate();
  }

  async startPlugin () {
    this.client.ws.connect({ debug: CRYPTO_DEBUG });
    this.loadStylesheet('style.scss');
    this._injectModal();
  }

  async _injectModal() {
    await sleep(1e3); // It ain't stupid if it works
    const { container } = await getModule([ 'container', 'usernameContainer' ]);
    const accountContainer = await waitFor(`section > .${container}`);
    const instance = getOwnerInstance(accountContainer);
    await inject('pc-crypto-modal', instance.__proto__, 'render', (_, res) => {
      const realRes = findInTree(res, t => t.props && t.props.className === container);
      return [
        React.createElement(Modal, {
          entityID: this.entityID,
          base: realRes
        }),
        res
      ];
    });
    instance.forceUpdate();
  }

  onCoinbaseConnect() {
    this.client.ws.subscribe([this.channel]);
  }

  onCoinbaseTicker(tickerMessage) {
    if(tickerMessage.type !== "ticker" || this.channel.product_ids.findIndex(x => x === tickerMessage.product_id) < 0)
      return;

    if(cryptoStore.storeLoading === true)
      cryptoStoreActions.updateCryptoLoading(false);

    cryptoStoreActions.updateCryptoPrice(tickerMessage);
  }

};
