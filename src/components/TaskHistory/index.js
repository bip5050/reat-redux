import React, { Component } from 'react';
import TaskHistoryContainer from '../../containers/TaskHistory';
import { withRouter } from 'react-router-dom';

class TaskHistory extends Component {
  render() {
    return (
      <div className="App">
        <TaskHistoryContainer/>
      </div>
    );
  }
}

export default withRouter(TaskHistory);;
