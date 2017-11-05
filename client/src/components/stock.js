import React, { Component } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import axios from 'axios';

class stock extends Component {
  constructor(props) {
    super(props);
  }

  deleteStock = () => {
    var _this = this;
    this.props.handleDelete(_this.props.idx);
    axios.post('/deleteStock', {
      name: this.props.name
    })
  }

  render() {
    const stockInstance = (
      <ListGroupItem onClick={this.deleteStock}>
        {this.props.name}
      </ListGroupItem>
    );

    return (
      <div>
        {stockInstance}
      </div>
    );
  }
}

export default stock;
