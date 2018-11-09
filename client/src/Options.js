import React, { Component } from 'react';

import './Options.css';

class Options extends Component {
  render() {
    return (
      <div className="Options">
        <span>
          width:&nbsp;
          <input
            className="options-input"
            type="number"
            name="width"
            onChange={this.props.onOptionChanged}
            defaultValue={this.props.width}
          />
        </span>
        <span>
          height:&nbsp;
          <input
            className="options-input"
            type="number"
            name="height"
            onChange={this.props.onOptionChanged}
            defaultValue={this.props.height}
          />
        </span>
        <span>
          high-density:&nbsp;
          <input
            className="options-checkbox"
            type="checkbox"
            name="targetPixelRatio"
            onChange={this.props.onOptionChanged}
            checked={this.props.highDensity}
          />
        </span>
      </div>
    );
  }
}

export default Options;
