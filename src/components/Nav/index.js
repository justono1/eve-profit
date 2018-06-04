import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Nav extends Component {
  render() {
    return (
      <nav>
        <ul>
          <li><Link to="/">Production</Link></li>
          <li><Link to="/market">Market</Link></li>
          <li><Link to="/inventory">Inventory</Link></li>
        </ul>
      </nav>
    );
  }
}

export default Nav;
