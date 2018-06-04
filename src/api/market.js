import axios from 'axios';
import api from './api';
import UniverseAPI from './universe';
import SearchAPI from './search';
import BpcMaterials from './bpc-materials';
import { split } from 'ramda';

const marketPrefix = `${api.prefix}/markets`;

export default {
  /**
    @param: region_id (required)(int), type_id (required)(int), order_type = sell (string)
    @return: a promise containing an array of market orders for ${type_id} in ${region_id}
  **/
  getRegionOrders(region_id, type_id, order_type = 'sell') {
    if (
      region_id !== undefined &&
      region_id !== null &&
      type_id !== undefined &&
      type_id !== null
    ) {
      let methodSuffix = `&order_type=${order_type}&type_id=${type_id}`;

      return axios
        .get(`${marketPrefix}/${region_id}/orders/${api.suffix}${methodSuffix}`)
        .then(res => res)
        .catch(e => {
          console.error(e);
        });
    } else {
      throw new Error('You are missing one of the required params');
    }
  },

  getItemHistory(region_id, type_id, order_type = 'sell') {
    if (
      region_id !== undefined &&
      region_id !== null &&
      type_id !== undefined &&
      type_id !== null
    ) {
      let methodSuffix = `&order_type=${order_type}&type_id=${type_id}`;

      return axios
        .get(`${marketPrefix}/${region_id}/history/${api.suffix}${methodSuffix}`)
        .then(res => res)
        .catch(e => {
          console.error(e);
        });
    } else {
      throw new Error('You are missing one of the required params');
    }
  },

  /**
    @param: type_id (required)(int), order_type = sell (string)
    @return: a promise containing an array of market orders for ${type_id} in all regions in universe
    @dependencies: UniverseAPI
  **/
  getUniverseOrders(type_id, order_type = 'sell') {
    let methodSuffix = `&order_type=${order_type}&type_id=${type_id}`;

    return new Promise(function(resolve, reject) {
      resolve(UniverseAPI.getRegions());
    })
      .then(result => {
        let regionOrders = [];

        result.data.forEach(region_id => {
          let regionPromise = axios.get(
            `${marketPrefix}/${region_id}/orders/${api.suffix}${methodSuffix}`
          );

          regionOrders.push(regionPromise);
        });

        return axios.all(regionOrders);
      })
      .then(result => {
        let universe_orders = [];
        result.forEach(order => {
          universe_orders = universe_orders.concat(order.data);
        });
        return universe_orders;
      })
      .catch(e => {
        console.error(e);
      });
  },
  getOrderLocation(location_id) {
    let stationName, systemName;
    return new Promise((resolve, reject) => {
      resolve(UniverseAPI.getStation(location_id));
    })
      .then(result => {
        stationName = result.data.name;
        return UniverseAPI.getSystem(result.data.system_id);
      })
      .then(result => {
        systemName = result.data.name;
        return UniverseAPI.getConstellation(result.data.constellation_id);
      })
      .then(result => {
        return UniverseAPI.getRegion(result.data.region_id);
      })
      .then(result => {
        return `${result.data.name} | ${systemName} | ${stationName}`;
      })
      .catch(e => {
        console.error('get order location');
      });
  },
  getRigDataFromBpc(exactName, type_id) {
    const rigName = split(' Blueprint', exactName)[0]; //if blueprint name is passed return rigs value
    let rigtype_id;
    let bpcMats;
    let lowestRigPrice = 0;
    let materialBaseCost = 0;
    let volume = 0;
    return new Promise((resolve, reject) => {
      resolve(SearchAPI.searchEve(rigName));
    })
      .then(res => {
        // =
        rigtype_id = res.data.inventory_type[0];
        return BpcMaterials.getBpcProductionMaterials(type_id);
      })
      .then(res => {
        let promises = [];
        // =
        bpcMats = res; // incase of needing to relate promises to thier origin
        promises.push(this.getRegionOrders(10000002, rigtype_id));
        bpcMats.map((value) => {
          promises.push(this.getRegionOrders(10000002, value.typeid, 'buy'));
        });
        return Promise.all(promises);
      })
      .then(res => {
        console.log('promisall', res);

        const materialsRes = res.slice(1);
        materialsRes.forEach((mat, index) => {
          let highestPrice = 0;
          mat.data.forEach(order => {
            if(order.price > highestPrice) {
              highestPrice = order.price
            }
          });
          materialBaseCost += Math.floor((highestPrice * bpcMats[index].quantity));
        });


        // =
        lowestRigPrice = res[0].data[0].price;
        console.log(lowestRigPrice);
        res[0].data.forEach(value => {
          if(value.price < lowestRigPrice) {
            lowestRigPrice = value.price
          }
        });
        return this.getItemHistory(10000002, rigtype_id);
      })
      .then(res => {
        let avgVolume = 0;
        const theWeek = res.data.slice(res.data.length - 8, res.data.length - 1);
        theWeek.forEach(value => {
          avgVolume += value.volume;
        });
        // =
        volume = Math.floor(avgVolume / theWeek.length);

        return {
          rigSalePrice: lowestRigPrice,
          rigMarketVolume: volume,
          rigBaseMaterialCost: materialBaseCost
        }
      })
      .catch(error => {
        console.log('error')
      });
  },

  getRigDataByTypeId(type_id) {
    let lowestPrice = 0;
    let volume = 0;
    return new Promise((resolve, reject) => {
      resolve(this.getRegionOrders(10000002, type_id));
    })
  }
};
