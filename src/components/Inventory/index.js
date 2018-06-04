import React, { Component } from 'react';
import { connect } from 'react-redux';
import { match, countBy, map, trim, compose, split, isEmpty } from 'ramda';
import SearchAPI from '../../api/search';

import { updateInventory } from '../../actions/inventoryActions';

class Inventory extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getBlueprintCount(rawInput) {
    if(rawInput !== '') {
      const getItemName = x => match('(?:(?!\t).)*', x)[0];
      const nameParse = map(getItemName);
  
      return (compose(
        countBy(trim),
        nameParse,
        split('\n')
      )(rawInput));
    } else {
      return undefined;
    }
  }

  getMaterialsCount(rawInput) {
    if(rawInput !== '') {
      let materials = {};
      
      const materialsArray = rawInput.split('\n');
      materialsArray.forEach((value) => {
        const splitMaterial = value.split('\t');
        const key = splitMaterial[0];
        const count = splitMaterial[1];
  
        if(materials[key] !== undefined) {
          materials[key] = parseInt(materials[key]) + parseInt(count);
        } else {
          materials[key] = count;
        }
        
      });
  
      return materials;
    } else {
      return undefined;
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    let inventory = {
      t2Bpc: [

      ],
      t1Bpc: [

      ],
      productionMaterials: [

      ],
      inventionMaterials: [

      ]
    };

    const t2BpcCount = this.getBlueprintCount(e.target.t2Bpc.value);
    const t1BpcCount = this.getBlueprintCount(e.target.t1Bpc.value);
    const productionMaterialsCount = this.getMaterialsCount(e.target.productionMaterials.value);
    const inventionMaterialsCount = this.getMaterialsCount(e.target.inventionMaterials.value);

    console.log('invent', inventionMaterialsCount);

    if(t1BpcCount !== undefined) {
      Object.keys(t1BpcCount).forEach((key) => {
        const item = {
          name: key,
          qty: t1BpcCount[key]
        };
        inventory.t1Bpc.push(item);
      });
    }

    if(productionMaterialsCount !== undefined) {
      Object.keys(productionMaterialsCount).forEach((key) => {
        const item = {
          name: key,
          qty: productionMaterialsCount[key]
        };
        inventory.productionMaterials.push(item);
      });
    }

    if(inventionMaterialsCount !== undefined) {
      Object.keys(inventionMaterialsCount).forEach((key) => {
        const item = {
          name: key,
          qty: inventionMaterialsCount[key]
        };
        inventory.inventionMaterials.push(item);
      });
    }

    if(t2BpcCount !== undefined) {
      const promises = [];
      const keyMap = [];
      Object.keys(t2BpcCount).forEach((key) => {

        // const item = {
        //   name: key,
        //   qty: t2BpcCount[key]
        // };
        keyMap.push(key);
        promises.push(SearchAPI.searchEve(key));
        // inventory.t2Bpc.push(item);
      });

      Promise.all(promises)
        .then(res => { 
          const bpc = res.map((value, index) => {
            return {
              name: keyMap[index],
              qty: t2BpcCount[keyMap[index]],
              type_id: value.data.inventory_type[0]
            }
          })
          inventory.t2Bpc = bpc;
          this.props.updateInventory(inventory);
          
        })
        .catch(e => { console.error(e) });
      
    }

  }

  render() {
    return (
      <form className="inventory-form" onSubmit={this.handleSubmit}>
      <button>Upate Inventory</button>
        <div className="flex-columns">
          <div className="column">
            <h4>T2 BPCS</h4>
            <textarea name="t2Bpc"></textarea>
          </div>
          <div className="column">
            <h4>T1 BPCS</h4>
            <textarea name="t1Bpc"></textarea>
          </div>
          <div className="column">
            <h4>Invention Materials</h4>
            <textarea name="inventionMaterials"></textarea>
          </div>
          <div className="column">
            <h4>Production Materials</h4>
            <textarea name="productionMaterials"></textarea>
          </div>
        </div>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  inventory: state.inventory
});

const mapDispatchToProps = (dispatch) => ({
  updateInventory: inventory => {
    dispatch(updateInventory(inventory));
    dispatch
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Inventory);
