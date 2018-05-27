import React, { Component } from 'react';
import { Provider } from 'react-redux';
import makeStore from './store/configureStore';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

//Components
import Nav from './components/Nav';
import Inventory from './components/Inventory';
import Production from './components/Production';

const store = makeStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
        <div className="view-container">
          <Nav />
          <main>
            <Route exact path='/' component={Production} />
            <Route path='/inventory' component={Inventory} />
          </main>
        </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
