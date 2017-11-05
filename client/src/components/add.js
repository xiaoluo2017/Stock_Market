import React, { Component } from 'react';
import axios from 'axios';
import { Form, FormGroup, ControlLabel, FormControl, Button, Col, ButtonGroup } from 'react-bootstrap';

class add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    }
  }

  handleName = (event) => {
    this.setState({
      name: event.target.value
    });
  }

  addStock = () => {
    axios.post('/insertStock', {
      name: this.state.name
    }) 
    let _this = this;
    this.props.handleInsert(_this.state.name);
    this.setState({
      name: ""
    });
  }

  render() {
    const buttonGroupInstance = (
      <ButtonGroup>
        <Button onClick={() => {this.props.handleRange("1m")}}>1m</Button>
        <Button onClick={() => {this.props.handleRange("3m")}}>3m</Button>
        <Button onClick={() => {this.props.handleRange("6m")}}>6m</Button>
        <Button onClick={() => {this.props.handleRange("1y")}}>1y</Button>
      </ButtonGroup>
    );

    const formInstance = (
      <Form inline>
        <Col sm={6}>
          <FormGroup controlId="formInlineName">
            {' '}
            <FormControl type="text" placeholder="Stock code" value={this.state.name} onChange={this.handleName}/>
          </FormGroup>
          {' '}
          <Button onClick={this.addStock}>
            Add
          </Button>
        </Col>
        <Col className="text-right" sm={6}>
          {buttonGroupInstance}
        </Col>
      </Form>
    );

    return(
      <div>
        {formInstance}
      </div>
    );
  }
}

export default add;
