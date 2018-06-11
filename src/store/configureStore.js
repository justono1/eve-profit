import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import { createLogger } from 'redux-logger';
import immutableCheckMiddleWare from 'redux-immutable-state-invariant';
import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-localstorage';
import debounce from 'redux-storage-decorator-debounce';
import filter from 'redux-storage-decorator-filter';

// Setup
const middleWare = [];

// Immutability Check
if (process.env.NODE_ENV === 'development') {
  middleWare.push(immutableCheckMiddleWare());
}

const initialState = {
  settings: {
    invetionSlots: 40,
    productionSlots: 40,
    iskPerRun: 3000000000,
  },
  inventory: {
    t2Bpc: [
      {
        name: 'Large Anti-EM Pump II Blueprint',
        qty: 20,
        type_id: 26287
      },
      {
        name: 'Large Anti-EM Screen Reinforcer II Blueprint',
        qty: 20,
        type_id: 26437
      }
    ],
    t1Bpc: [
      {
        name: 'Large Anti-EM Pump I Blueprint',
        qty: 5,
      },
      {
        name: 'Large Anti-EM Screen Reinforcer I Blueprint',
        qty: 5,
      }
    ],
    productionMaterials: [
      {
        name: 'Intact Armor Plates',
        qty: 300
      }
    ],
    inventionMaterials: [
      {
        name: 'Symmetry Decryptor',
        qty: 20
      }
    ]
  },
  productionStage: {
    date: Date(),
    estimatedCost: 123123123,
    projectedProfit: 1231234123,
    bpc: [
      {
        name: 'Large Anti-EM Pump II Blueprint',
        inventionRuns: 2,
        productionRuns: 2,
        profitMargin: .2,
        profitPerDay: 12000000,
        marketVolume: .25,
        t2Inventory: 20,
        t1Inventory: 0
     }
    ],
    materialsNeeded: {
      productionMaterials: [
        {
          name: 'Intact Armor Plates',
          typeId: 234,
          qty: 320
        }
      ],
      inventionMaterials: [
        {
          name: 'Symmetry Decryptor',
          typeId: 234,
          qty: 23
        }
      ]
    }
  },
  market: [
    {
      name: 'Large Anti-EM Pump II',
      qty: 2,
      type_id: 26287
    },
    {
      name: 'Large Anti-EM Screen Reinforcer II',
      qty: 6,
      type_id: 26437
    }
  ],
   previousProductionRuns: [
    {
      date: Date(),
      estimatedCost: 1200000000,
      projectedProfit: 1000,
      bpc: [
        {
        name: 'Large Anti-EM Pump II Blueprint',
        inventionRuns: 0,
        productionRuns: 2,
        profitMargin: .1,
        profitPerDay: 10000000,
        marketVolume: .25
        }
      ]
    }
  ]
}

// Redux Store
const wrappedReducer = storage.reducer(rootReducer);

let engine = createEngine('my-save-key');
engine = debounce(engine, 1000);
engine = filter(engine, ['auth']);

const reduxStorageMiddleware = storage.createMiddleware(engine);
middleWare.push(reduxStorageMiddleware);
const loadStore = storage.createLoader(engine);

// Logger Middleware. This always has to be last
const loggerMiddleware = createLogger({
  predicate: () => process.env.NODE_ENV === 'development',
});
middleWare.push(loggerMiddleware);

const createStoreWithMiddleware = applyMiddleware(...middleWare)(createStore);
export default function makeStore(callback) {
 const store = createStoreWithMiddleware(wrappedReducer, initialState);
 loadStore(store)
  .then((newState) => console.log('Loaded state:', newState))
  .catch(() => console.log('Failed to load previous state'));
  return store;
}