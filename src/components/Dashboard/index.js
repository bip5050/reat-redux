import React, { Component } from 'react';
import DashboardList from '../../containers/Dashboard';
import { withRouter } from 'react-router-dom';

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <DashboardList userData={this.props.userData}/>
      </div>
    );
  }
}

export default withRouter(Dashboard);;
