import axios from 'axios';
import api from './api';

const universePrefix = `${api.prefix}/universe`;

export default {
  getRegion(region_id) {
    return axios
      .get(`${universePrefix}/regions/${region_id}/${api.suffix}`)
      .then(res => res)
      .catch(e => {
        console.log(e);
      });
  },
  getRegions() {
    return axios
      .get(`${universePrefix}/regions/${api.suffix}`)
      .then(res => res)
      .catch(e => {
        console.log(e);
      });
  },
  getType(type_id) {
    return axios
      .get(`${universePrefix}/types/${type_id}/${api.suffix}`)
      .then(res => res)
      .catch(e => {
        console.error('getType Error');
      });
  },
  getTypes(type_ids) {
    let types = [];
    type_ids.forEach(type => {
      types.push(
        axios.get(`${universePrefix}/types/${type}/${api.suffix}`).then(res => {
          return res.data;
        })
      );
    });

    return axios.all(types);
  },
  getStation(station_id) {
    return axios
      .get(`${universePrefix}/stations/${station_id}/${api.suffix}`)
      .then(res => res)
      .catch(e => {
        console.error('get station error');
      });
  },
  getSystem(system_id) {
    return axios
      .get(`${universePrefix}/systems/${system_id}/${api.suffix}`)
      .then(res => res)
      .catch(e => {
        console.log(e);
      });
  },
  getConstellation(constellation_id) {
    return axios
      .get(`${universePrefix}/constellations/${constellation_id}/${api.suffix}`)
      .then(res => res)
      .catch(e => {
        console.log(e);
      });
  },
  getNames(ids) {
    return axios
      .post(`${universePrefix}/names/${api.suffix}`, ids)
      .then(res => res)
      .catch(e => {
        console.log(e);
      });
  }
};
