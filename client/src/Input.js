import React, { Component } from 'react';

import './Input.css';

class Input extends Component {
  render() {
    return (
      <div className="Input">
        <input
          className="hash-input"
          type="text"
          placeholder="Enter comma-separated graph hashes..."
          onChange={this.props.onInputChanged}
        />
        <button
          className="input-button"
          onClick={this.props.onSubmitHashes}
        >
          Generate Thumbnails
        </button>
      </div>
    );
  }
}

export default Input;
