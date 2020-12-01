const { React, Flux } = require('powercord/webpack');
const { FormTitle, Text } = require('powercord/components');
const { Modal } = require('powercord/components/modal');
const { close: closeModal } = require('powercord/modal');

const cryptoStore = require('../cryptoStore/store');
const { getImgSrc, CRYPTO_CHANNELS } = require('../constants');


class CryptoChart extends React.PureComponent {
  buildIFrameUrl() {
    const currentCrypto = this.props.currentCrypto.replace('-', '');

    const symbol = `COINBASE:${currentCrypto}`;
    const url = new URL("https://s.tradingview.com/widgetembed/");
    const params = {
      frameElementId:     "tradingview_8ea70",
      symbol:             symbol,
      interval:           "D",
      hidesidetoolbar:    "0",
      details:            "1",
      symboledit:         "1",
      saveimage:          "1",
      toolbarbg:          "f1f3f6",
      studies:            "[]",
      theme:              "dark",
      timezone:           "Etc/UTC",
      studies_overrides:  "[]",
      overrides:          "[]",
      enabled_features:   "[]",
      disabled_features:  "[]",
      locale:             "en",
      utm_source:         "canary.discord.com",
      utm_medium:         "widget",
      utm_campaign:       "chart",
      utm_term:           symbol
    }

    for(let i in params)
      url.searchParams.append(i, params[i]);

    return url.href;
  }

  render() {
    const { currentCrypto } = this.props;
    const currencyInfo = CRYPTO_CHANNELS[currentCrypto];


    return (
        <Modal size={Modal.Sizes.LARGE} id="crypto-charter">
          <Modal.Header>
            <FormTitle tag="h4" id="crypto-chart-header">
              <img class="chart-crypto-icon" src={getImgSrc(currencyInfo.icon)} />
              {currencyInfo.name} CryptoCurrency Chart
            </FormTitle>
            <Modal.CloseButton onClick={() => closeModal()}/>
          </Modal.Header>
          <Modal.Content id="crpyto-modal-container">
            <iframe 
              id="tradingview_8ea70"
              class="crypto-chart"
              src={this.buildIFrameUrl()}
              frameborder="0"
              allowtransparency="true"
              scrolling="no" allowfullscreen="">
            </iframe>
          </Modal.Content>
        </Modal>
    ) ;
  }
}

module.exports = Flux.connectStores(
  [
    cryptoStore, 
    powercord.api.settings.store
  ],
  (props) => ({
    ...cryptoStore.getStore(),
    ...powercord.api.settings._fluxProps(props.entityID)
  })
)(CryptoChart);