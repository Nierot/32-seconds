import React from 'react';
import config from '../config.json';
export default class AddWordForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="AddWordForm">
        <h1>TODO</h1>
        <h2>{config.api}</h2>
      </div>
    )
  }
}