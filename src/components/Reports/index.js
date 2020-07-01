import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ReportsContainer from '../../containers/Reports';

class Reports extends Component {
	render() {
		return (
			<div className="App">
				<ReportsContainer />
			</div>
		);
	}
}

export default withRouter(Reports);
