import { combineReducers } from "redux";

//Reducers
import settingsReducer from './settingsReducer';
import inventoryReducer from './inventoryReducer';
import productionStageReducer from './productionStageReducer';
import previousProductionRunsReducer from './previousProductionRunsReducer';

const rootReducer = combineReducers({
  settings: settingsReducer,
  inventory: inventoryReducer,
  productionStage: productionStageReducer,
  previousProductionRuns: previousProductionRunsReducer,
})

export default rootReducer;