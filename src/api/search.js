import axios from 'axios';
import api from './api';

const searchPrefix = `${api.prefix}/search`;

export default {
  searchEve(queryString, categories = ['inventory_type'], strict = true) {
    categories = encodeURIComponent(categories.join(','));
    return axios
      .get(
        `${searchPrefix}/${api.suffix}&categories=${categories}&search=${
          queryString
        }&strict=${strict}`
      )
      .then(res => res)
      .catch(e => {
        console.error('error happened in search');
      });
  }
};
