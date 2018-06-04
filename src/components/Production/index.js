import React, { Component } from 'react';
import { connect } from 'react-redux';

import BpcRows from './BpcRows';

class Production extends Component {
  constructor(props) {
    super(props);

    // this.runAPI = this.runAPI.bind(this);
  }

  render() {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>BPC</th>
              <th>Invent</th>
              <th>Produce</th>
              <th>Build Cost</th>
              <th>$ Margin</th>
              <th>$/day</th>
              <th>Volume</th>
              <th>T2 Inventory</th>
              <th>T1 Inventory</th>
            </tr>
          </thead>
          <BpcRows t2Bpc={this.props.inventory.t2Bpc} />
        </table>
        <button onClick={this.runAPI}>Build Order</button><button>Submit Order</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  inventory: state.inventory
});

// const mapDispatchToProps = (dispatch) => ({
//   updateInventory: inventory => {
//     dispatch(updateInventory(inventory));
//   }
// });

export default connect(
  mapStateToProps,
  // mapDispatchToProps
)(Production);
