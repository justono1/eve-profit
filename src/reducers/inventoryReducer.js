const inventoryReducer = (state = '', action) => {
  switch(action.type) {
    case 'UPDATE_INVENTORY':    
      return {
        ...state,
        ...action.inventory
      };
    default:
      return state;
  }
}

export default inventoryReducer;