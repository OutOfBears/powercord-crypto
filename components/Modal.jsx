const { React, Flux, getModuleByDisplayName, contextMenu } = require('powercord/webpack');
const { AsyncComponent, Icons: { FontAwesome } } = require('powercord/components');


const cryptoStore = require('../cryptoStore/store');
const cryptoStoreActions = require('../cryptoStore/actions');
const { formatCurrency, CRYPTO_CHANNELS } = require('../constants');

const PopoutMenu = require("./PopoutMenu");

// extra components
const PanelSubtext = AsyncComponent.from(getModuleByDisplayName('PanelSubtext'));


class Modal extends React.PureComponent {
  state = {
    popoutOpen: false
  }

  showSelectMenu(e) {
    contextMenu.openContextMenu(e, () => React.createElement(ContextMenuComp))
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

    const nameComponent = this.props.base.props.children[1].props.children({});
    delete nameComponent.props.onMouseLeave;
    delete nameComponent.props.onMouseEnter;
    delete nameComponent.props.onClick;

    [ nameComponent.props.className ] = nameComponent.props.className.split(' ');
    nameComponent.props.children[0].props.className = 'crypto-title';
    nameComponent.props.children[0].props.children.props.children = `${currencyInfo.name} (${currentCrypto})`;
    nameComponent.props.children[1] = (
      <PanelSubtext className='crypto-price'>
        {formatCurrency(cryptoState.prices[currentCrypto], currencyInfo.precision)}
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
        { popoutOpen && <PopoutMenu onClose={() => this.setState({ popoutOpen: false })} />}

        <img src={currencyInfo.icon} />
        <div class="info">
          {this.renderNameComponent()}
        </div>
        <div class="actions">
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