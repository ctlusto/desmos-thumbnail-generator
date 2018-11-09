import React, { Component } from 'react';

import './Hash.css';

const getStatusIcon = status => {
  switch (status) {
    case 'error':
      return '\u2718';
    case 'success':
      return '\u2714';
    default:
      return '---'
  }
};

const getStatusClass = status => {
  const baseClass = 'table-cell';
  let colorClass;

  switch (status) {
    case 'error':
      colorClass = 'red';
      break;
    case 'success':
      colorClass = 'green';
      break;
    default:
      colorClass = '';
  }

  return `${baseClass} ${colorClass}`;
};

class Hash extends Component {
  render() {
    return (
      <tr className="Hash">
        <td className="table-cell">{this.props.id}</td>
        <td
          className={getStatusClass(this.props.status)}
        >
          {getStatusIcon(this.props.status)}
        </td>
      </tr>
    );
  }
}

export default Hash;
