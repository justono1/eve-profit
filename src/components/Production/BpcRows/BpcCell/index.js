import React, { Component } from 'react';

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
      volume: .1,
      profitPerDay: 0
    };

    this.handleInventionQty = this.handleInventionQty.bind(this);
    this.handleProductionQty = this.handleProductionQty.bind(this);
  }

  componentDidMount() {
    const {name, typeId} = this.props;
    MarketAPI.getRigDataFromBpc(name, typeId)
      .then((res) => {
        this.setState({
          rigSalePrice: res.rigSalePrice,
          rigMarketVolume: res.rigMarketVolume,
          rigBaseMaterialCost: res.rigBaseMaterialCost,
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
    this.setState({
      productionQty: qty,
      buildCost: rigBaseMaterialCost * qty,
      profitMargin: qty > 0 ? ((rigSalePrice * qty) - (rigBaseMaterialCost * qty)) / (rigSalePrice * qty) : 0,
      profitPerDay: (Math.ceil(rigMarketVolume * .25)) * rigSalePrice,
      t2bpcQty: this.props.t2bpcQty - qty
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
        <td>%%%%</td>
        <td>{this.state.t2bpcQty}</td>
        <td>{this.state.t1bpcQty}</td>
      </tr>
    );
  }
}

export default BpcCell;
