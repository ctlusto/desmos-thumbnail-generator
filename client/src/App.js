import React, { Component } from 'react';
import Input from './Input';
import Options from './Options';
import HashTable from './HashTable';
import ProgressBar from './ProgressBar';

import './App.css';

// Final hash states
const PROCESSED = 'processed';
const ERROR = 'error';

class App extends Component {
  constructor(props) {
    super(props);

    this.calculator = window.Desmos.GraphingCalculator();

    this.state = {
      width: 500,
      height: 500,
      targetPixelRatio: 1,
      input: '',
      hashes: {},
      completed: 0
    };

    this.onSubmitHashes = this.onSubmitHashes.bind(this);
    this.onInputChanged = this.onInputChanged.bind(this);
    this.onOptionChanged = this.onOptionChanged.bind(this);
    this.generateImages = this.generateImages.bind(this);
  }

  render() {
    return (
      <div className="App">
        <Input
          onSubmitHashes={this.onSubmitHashes}
          onInputChanged={this.onInputChanged}
        />
        <Options
          width={this.state.width}
          height={this.state.height}
          highDensity={this.state.targetPixelRatio === 2}
          onOptionChanged={this.onOptionChanged}
        />
        <ProgressBar percent={this.getPercentCompleted()}/>
        <HashTable hashes={this.state.hashes} />
      </div>
    );
  }

  // Handle the input that accepts a list of graph hashes.
  onInputChanged(evt) {
    this.setState({
      ...this.state,
      ...{
        input: evt.target.value
      }
    });
  }

  // Handle image option changes.
  onOptionChanged(evt) {
    const { target } = evt;
    let value;
    if (target.type === 'checkbox') {
      value = target.checked ? 2 : 1; // pixel ratio
    } else {
      value = parseInt(target.value, 10); // width and height
    }

    this.setState({
      ...this.state,
      ...{ [target.name]: value }
    });
  }

  // Handle form submission.
  onSubmitHashes() {
    const hashes = {};
    const raw = this.state.input.split(',').map(hash => hash.trim());
    raw.forEach(hash => {
      if (hash.length && !hashes.hasOwnProperty(hash)) {
        hashes[hash] = { id: hash, processed: false, error: false };
      }
    });

    this.setState({
      ...this.state,
      ...{ completed: 0, hashes }
    }, this.generateImages);
  }

  // A hash is done when it's either been successfully processed or has thrown.
  markHashDone(hash, status) {
    const hashes = JSON.parse(JSON.stringify(this.state.hashes));
    hashes[hash][status] = true;

    this.setState({
      ...this.state,
      ...{ hashes }
    });
  }

  // Keep track of how many hashes we've processed or have errored.
  updateProgress() {
    this.setState({
      ...this.state,
      ...{ completed: this.state.completed + 1 }
    });
  }

  // Convert progress to a percent so we can update the progress bar.
  getPercentCompleted() {
    const completed = this.state.completed;
    if (completed === 0) return 0;
    const fraction = completed / Object.keys(this.state.hashes).length;

    return Math.round(100 * fraction);
  }

  // Get the graph data associated with the has from Desmos.
  async getGraphData(hash) {
    const url = `https://www.desmos.com/calculator/${hash}`;
    const options = {
      mode: 'cors',
      headers: { Accept: 'application/json' }
    };
    const res = await fetch(url, options);

    return res.json();
  }

  // Generate the PNG data URI.
  async generateThumbData(hash) {
    const { width, height, targetPixelRatio } = this.state;
    const data = await this.getGraphData(hash);
    this.calculator.setState(data.state);

    return new Promise((resolve, reject) => {
      this.calculator.asyncScreenshot(
        { width, height, targetPixelRatio },
        uri => resolve(uri)
      );
    });
  }

  // Hit the local server endpoint that will process the image.
  async generateImage(hash) {
    const uri = await this.generateThumbData(hash);
    const { width, height, targetPixelRatio } = this.state;
    const endpoint = '/api/generate';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uri, hash, width, height, targetPixelRatio })
    };
    const res = await fetch(endpoint, options);

    return res.json();
  }

  // Loop through the hashes and process them.
  // Note that this is the only place async error handling happens. An error
  // here could have come from any of the async steps.
  async generateImages() {
    for (const hash in this.state.hashes) {
      if (!this.state.hashes.hasOwnProperty(hash)) continue;
      try {
        const res = await this.generateImage(hash);
        if (res.success) {
          this.markHashDone(hash, PROCESSED);
        } else {
          this.markHashDone(hash, ERROR);
        }
      } catch(e) {
        this.markHashDone(hash, ERROR);
      } finally {
        this.updateProgress();
      }
    }
  }
}

export default App;
