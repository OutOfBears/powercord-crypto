const { React, Flux, getModuleByDisplayName, contextMenu } = require('powercord/webpack');
const { AsyncComponent, Icons: { FontAwesome } } = require('powercord/components');
const { open: openModal } = require('powercord/modal');

const cryptoStore = require('../cryptoStore/store');
const cryptoStoreActions = require('../cryptoStore/actions');
const { formatCurrency, calcPercentage, getImgSrc, CRYPTO_CHANNELS } = require('../constants');

const PopoutMenu = require("./PopoutMenu");
const CryptoChart = require("./CryptoChart");


// extra components
const PanelSubtext = AsyncComponent.from(getModuleByDisplayName('PanelSubtext'));


class Modal extends React.PureComponent {
  state = {
    popoutOpen: false
  }

  showSelectMenu(e) {
    contextMenu.openContextMenu(e, () => React.createElement(ContextMenuComp))
  }

  showCryptoChart(e) {
    openModal(() => React.createElement(CryptoChart));
  }

  // credit to spotify plugin, for these good render functions
  renderButton (tooltipText, icon, onClick, disabled, className) {
    return {
      ...this.props.base.props.children[2].props.children[0],
      props: {
        ...this.props.base.props.children[2].props.children[0].props,
        icon: () => React.createElement(FontAwesome, {
          className,
          icon
        }),
        tooltipText: tooltipText(),
        disabled,
        onClick
      }
    };
  }

  // this one too
  renderNameComponent() {
    const { cryptoState, currentCrypto } = this.props;
    const currencyInfo = CRYPTO_CHANNELS[currentCrypto];
    const prices = cryptoState.prices[currentCrypto];

    const perc = calcPercentage(prices.last24Price, prices.price);
    const nameComponent = this.props.base.props.children[1].props.children({});
    delete nameComponent.props.onMouseLeave;
    delete nameComponent.props.onMouseEnter;
    delete nameComponent.props.onClick;

    [ nameComponent.props.className ] = nameComponent.props.className.split(' ');
    nameComponent.props.children[0].props.className = 'crypto-title';
    nameComponent.props.children[0].props.children.props.children = `${currencyInfo.name} (${currentCrypto})`;
    nameComponent.props.children[1] = (
      <PanelSubtext className={`crypto-price ${perc.d ? 'down' : 'up'}`}>
        {formatCurrency(prices.price, currencyInfo.precision)}
        {(prices.price !== 0 || prices.last24Price !== 0) ?
           ` (${perc.d ? '-' : '+'}${(perc.p * 100).toFixed(2)}%)` : ''}
      </PanelSubtext>
    );
    return nameComponent;
  }

  // i made this one
  render() {
    const { popoutOpen } = this.state;
    const { cryptoState, currentCrypto } = this.props;
    const currencyInfo = CRYPTO_CHANNELS[currentCrypto];

    return cryptoState.loading ? null : (
      <div className={'powercord-crypto'}>
        <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
        { popoutOpen && <PopoutMenu onClose={() => this.setState({ popoutOpen: false })} />}

        <img src={getImgSrc(currencyInfo.icon)} />
        <div class="info">
          {this.renderNameComponent()}
        </div>
        <div class="actions">
          {this.renderButton(() => 'View CryptoCurrency Chart', 'chart-line', () => this.showCryptoChart())}
          {this.renderButton(() => 'Select CryptoCurrency', 'chevron-up', () => this.setState({ popoutOpen: true }))}
        </div>
      </div>
    )
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
)(Modal);