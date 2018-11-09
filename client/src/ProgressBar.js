import React, { Component } from 'react';

import './ProgressBar.css';

class ProgressBar extends Component {
  render() {
    return (
      <div
        className="ProgressBar"
        style={({ width: `${this.props.percent}%`})}
      >
      </div>
    );
  }
}

export default ProgressBar;
