import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import SettingsContainer from '../../containers/Settings';

class Setting extends Component {
	render() {
		return (
			<div className="App">
				<SettingsContainer />
			</div>
		);
	}
}

export default withRouter(Setting);
