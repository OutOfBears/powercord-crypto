const { React, Flux } = require('powercord/webpack');
const { Menu } = require('powercord/components');

const cryptoStore = require('../cryptoStore/store');
const cryptoStoreActions = require('../cryptoStore/actions');
const { formatCurrency, getImgSrc, CRYPTO_CHANNELS } = require('../constants');

const cryptoCurrencies = Object.keys(CRYPTO_CHANNELS);

class PopoutMenu extends React.Component {
  constructor(props) {
    super(props);

    this.wrapperRef = React.createRef();
    this.onWindowClick = this.onWindowClick.bind(this);
}

  componentDidMount() {
    document.addEventListener('mousedown', this.onWindowClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onWindowClick);
  }

  onWindowClick(e) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(e.target)) {
      this.props.onClose();
    }
  }

  selectCrypto(crypto) {
    cryptoStoreActions.selectCrypto(crypto);
    this.props.onClose();
  }

  renderCurrencies() {
    let components = [];
    const { prices } = this.props.cryptoState;

    cryptoCurrencies.forEach(idx => {
      let currency = CRYPTO_CHANNELS[idx];

      components.push(
        <Menu.MenuItem 
          id={idx} 
          label={currency.name} 
          subtext={formatCurrency(prices[idx].price, currency.precision)}
          action={() => this.selectCrypto(idx)}
          icon={
            () => <svg width="18" height="18" class="pc-crypto-menu-icon"
                xmlns="http://www.w3.org/2000/svg">       
                <image href={getImgSrc(currency.icon)} height="18" width="18"/>
              </svg>
            }
        />
      );
    });

    return components;
  }

  render() {

    return ( 
      <div ref={this.wrapperRef} class="pc-crypto-popout">
        <Menu.Menu 
          onClose={this.props.onClose}
          navId='pc-crypto-menu' 
          style="styleFixed">
          <Menu.MenuGroup>
            { this.renderCurrencies() }
          </Menu.MenuGroup>
        </Menu.Menu>
      </div>
    );
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
)(PopoutMenu);