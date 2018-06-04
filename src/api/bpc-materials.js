import axios from 'axios';

const activityMap = {
  production: '1',
  invention: 8
}

export default  {
  getBpcProductionMaterials(type_id) {
    return axios
      .get(`https://www.fuzzwork.co.uk/blueprint/api/blueprint.php?typeid=${type_id}`)
      .then(res => res.data.activityMaterials[activityMap.production])
      .catch(e => {
        console.error(e);
      });
  }
}