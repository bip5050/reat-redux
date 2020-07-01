import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import FeedBackContainer from '../../containers/Feedbacks';

class FeedBack extends Component {
	render() {
		return (
			<div className="App">
				<FeedBackContainer />
			</div>
		);
	}
}

export default withRouter(FeedBack);
