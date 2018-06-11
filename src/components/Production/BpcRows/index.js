import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import BpcCell from './BpcCell';

class BpcRows extends Component {
  constructor(props) {
    super(props);

    this.buildRows = this.buildRows.bind(this);
  }

  

  buildRows() {
    if(this.props.t2Bpc !== undefined) {
      const rows = this.props.t2Bpc.map((bpc) => {

        const t1bpc = this.props.inventory.t1Bpc.find(obj => {
          return obj.name === bpc.name.replace('II', 'I');
        });


        return(
          // <tr key={bpc.name}>
            <BpcCell key={bpc.name} name={bpc.name} typeId={bpc.type_id} t2bpcQty={bpc.qty} t1bpcQty={t1bpc.qty} />
          // </tr>
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

const mapStateToProps = (state) => ({
  inventory: state.inventory
});

export default connect(
  mapStateToProps,
  // mapDispatchToProps
)(BpcRows);
