import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import MarketAPI from '../../../api/market';

class BpcRows extends Component {
  constructor(props) {
    super(props);

    this.buildRows = this.buildRows.bind(this);
  }

  componentDidMount() {
    console.log('mount', this.props.t2Bpc.type_id);
    MarketAPI.getRigDataFromBpc('Large Anti-EM Pump II Blueprint', 26287)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  buildRows() {
    if(this.props.t2Bpc !== undefined) {
      const rows = this.props.t2Bpc.map((bpc) => {
        return(
          <tr key={bpc.name}>
            <td>{bpc.name} | {bpc.type_id}</td>
            <td><input type="text" name="inventionRuns" /></td>
            <td><input type="text" name="productionRuns" /></td>
            <td>24.4</td>
            <td>10%</td>
            <td>24.5</td>
            <td>10%</td>
            <td>{bpc.qty}</td>
            <td>3</td>
          </tr>
        );
      });

      return rows;
      
    } else {
      return(
        <tr>
          <td colSpan="8">No BPC Inventory. Add Some to your <Link to="/inventory">Inventory</Link></td>
        </tr>
      )
    }
    
  }

  render() {
    return (
      <tbody>
        {this.buildRows()}
      </tbody>
    );
  }
}

export default BpcRows;
