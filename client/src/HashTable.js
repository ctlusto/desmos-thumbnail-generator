import React, { Component } from 'react';
import Hash from './Hash';

import './HashTable.css';

const getStatus = hash => {
  if (hash.error) return 'error';
  return hash.processed ? 'success' : 'pending';
};

class HashTable extends Component {
  render() {
    return (
      <table className="HashTable">
        <tbody>
          <tr className="table-row">
            <th className="table-header">Graph Hash</th>
            <th className="table-header">Status</th>
          </tr>
          {this.getHashIds().map(id => this.renderRow(this.props.hashes[id]))}
        </tbody>
      </table>
    );
  }

  renderRow(hash) {
    return (
      <Hash
        key={hash.id}
        id={hash.id}
        status={getStatus(hash)}
      />
    );
  }

  getHashIds() {
    return Object.keys(this.props.hashes);
  }
}

export default HashTable;
