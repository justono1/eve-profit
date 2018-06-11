import React, { Component } from 'react';
import { connect } from 'react-redux';


import MarketAPI from '../../../../api/market';

class BpcCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.name,
      t2bpcQty: this.props.t2bpcQty,
      t1bpcQty: this.props.t1bpcQty,
      inventionQty: 0,
      productionQty: 0,
      rigSalePrice: 0,
      rigMarketVolume: 0,
      rigBaseMaterialCost: 0,
      buildCost: 0,
      profitMargin: 0,
      volume: 0,
      profitPerDay: 0
    };

    this.getMarketMatch = this.getMarketMatch.bind(this);

    this.handleInventionQty = this.handleInventionQty.bind(this);
    this.handleProductionQty = this.handleProductionQty.bind(this);
  }

  getMarketMatch(bpcName) {
    return this.props.market.find(obj => {
      return obj.name === bpcName.replace(' Blueprint', '');
    });
  }

  componentDidMount() {
    const {name, typeId} = this.props;
    const marketMatch = this.getMarketMatch(name);

    MarketAPI.getRigDataFromBpc(name, typeId)
      .then((res) => {
        this.setState({
          rigSalePrice: res.rigSalePrice,
          rigMarketVolume: res.rigMarketVolume,
          rigBaseMaterialCost: res.rigBaseMaterialCost,
          volume: marketMatch ? parseInt(marketMatch.qty / (res.rigMarketVolume * .25)) : 0
        });
      })
      .catch((e) => {
        console.error(e);
      });
  }

  handleInventionQty(event) {
    const qty = event.target.value;
    this.setState({
      inventionQty: qty,
      t1bpcQty: this.props.t1bpcQty - qty
    });
    console.log(this.state);
  }

  handleProductionQty(event) {
    const {rigSalePrice, rigBaseMaterialCost, rigMarketVolume} = this.state;
    const qty = event.target.value;
    const marketMatch = this.getMarketMatch(this.state.name);

    this.setState({
      productionQty: qty,
      buildCost: rigBaseMaterialCost * qty,
      profitMargin: qty > 0 ? ((rigSalePrice * qty) - (rigBaseMaterialCost * qty)) / (rigSalePrice * qty) : 0,
      profitPerDay: (Math.ceil(rigMarketVolume * .25)) * rigSalePrice,
      t2bpcQty: this.props.t2bpcQty - qty,
      volume: marketMatch ? parseInt((parseInt(marketMatch.qty) + parseInt(qty)) / (rigMarketVolume * .25)) : 0
    });
    console.log(this.state);
  }

  render() {
    return (
      <tr>
        <td>{this.state.name}</td>
        <td><input type="text" name="inventionRuns" onChange={this.handleInventionQty} /></td>
        <td><input type="text" name="productionRuns" onChange={this.handleProductionQty} /></td>
        <td>{Math.floor(this.state.buildCost * .000001)}</td>
        <td>{Math.floor(this.state.profitMargin * 100)}%</td>
        <td>{Math.floor(this.state.profitPerDay * .000001)}</td>
        <td>{this.state.volume * 100}%</td>
        <td>{this.state.t2bpcQty}</td>
        <td>{this.state.t1bpcQty}</td>
      </tr>
    );
  }
}

const mapStateToProps = (state) => ({
  market: state.market
});

export default connect(
  mapStateToProps,
  // mapDispatchToProps
)(BpcCell);
