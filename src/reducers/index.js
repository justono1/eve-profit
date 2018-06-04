import { combineReducers } from "redux";

//Reducers
import settingsReducer from './settingsReducer';
import inventoryReducer from './inventoryReducer';
import productionStageReducer from './productionStageReducer';
import previousProductionRunsReducer from './previousProductionRunsReducer';
import marketReducer from './marketReducer';

const rootReducer = combineReducers({
  settings: settingsReducer,
  inventory: inventoryReducer,
  productionStage: productionStageReducer,
  previousProductionRuns: previousProductionRunsReducer,
  market: marketReducer
})

export default rootReducer;