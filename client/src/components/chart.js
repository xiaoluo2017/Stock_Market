import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Button, Jumbotron, ListGroup, ButtonGroup } from 'react-bootstrap';
import $ from 'jquery';
import Stock from './stock';
import Add from './add';
import axios from 'axios';

let functionLock = true;

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stocks: [],
      data: [],
      range: "1y"
    };
  }

  componentWillMount() {
    const _this = this;
    let init = [];
    let cnt = 0;
    const start_date = this.getStartDate(this.state.range);

    fetch('/findStocks')
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      let stocks = [];
      for (let k = 0; k < data.length; k++) {
        stocks.push(data[k].name);
      }
      _this.setState({ 
        stocks: stocks
      });
    })
    .then(function() {
      $.each(_this.state.stocks, function(i, stock) {
        let url = "https://www.quandl.com/api/v3/datasets/WIKI/" + stock + ".json?api_key=X4rsMAfJU82yB7nQuDeD&start_date=" + start_date;
        $.getJSON(url, function(json) {
          let res = json.dataset.data;
          for (let j = res.length - 1; j >= 0; j--) {
            if (cnt === 0) {
              let newData = {
                "Date": res[j][0]
              };
              newData[stock] = res[j][1];
              init.push(newData);
            } else if (res.length - 1 - j < init.length) {
              init[res.length - 1 - j][stock] = res[j][1];
            }
            if (j === 0) cnt++;
            if (cnt === _this.state.stocks.length) {
              _this.setState({
                data: init
              });
            }
          }
        }); 
      });
    })
    functionLock = false;
  } 

  changeRange = (range) => {
    if (!functionLock) {
      functionLock = true;
      console.log("changeRange: " + range);
      const _this = this;
      let init = [];
      let num = 0;
      const start_date = this.getStartDate(range);
      $.each(this.state.stocks, function(i, stock) {
        let url = "https://www.quandl.com/api/v3/datasets/WIKI/" + stock + ".json?api_key=X4rsMAfJU82yB7nQuDeD&start_date=" + start_date;
        $.getJSON(url, function(json) {
          let res = json.dataset.data;
          for (let j = res.length - 1; j >= 0; j--) {
            if (num === 0) {
              let newData = {
                "Date": res[j][0]
              };
              newData[stock] = res[j][1];
              init.push(newData);
            } else if (res.length - 1 - j < init.length) {
              init[res.length - 1 - j][stock] = res[j][1];
            }
            if (j === 0) num++;
            if (num === _this.state.stocks.length) {
              _this.setState({
                data: init,
                range: range
              });
            }
          }
        }); 
      }); 
      console.log("changeRange: " + range + " end");
      functionLock = false;
    }
  }

  getStartDate = (range) => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    } 
    if (mm < 10) {
      mm = '0' + mm
    } 
    let start_date;
    if (range === "1m") {
      if (mm == 1) {
        yyyy -= 1;
        mm = 12;
      } else {
        mm -= 1;
      }
    } else if (range === "3m") {
      if (mm <= 3) {
        yyyy -= 1;
        mm += 9;
      } else {
        mm -= 3;
      }
    } else if (range === "6m") {
      if (mm <= 6) {
        yyyy -= 1;
        mm += 6;
      } else {
        mm -= 6;
      }
    } else {
      yyyy -= 1;
    }
    start_date = yyyy + "-" + mm + "-" + dd;
    return start_date;
  }

  getRandomColor = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getColor = (index) => {
    let colors = ['#8884d8', '#82ca9d', '#ff7300'];
    return colors[index];
  }

  addStock = (name) => {
    if (!functionLock) {
      functionLock = true;
      let start_date = this.getStartDate(this.state.range);
      let url = "https://www.quandl.com/api/v3/datasets/WIKI/" + name + ".json?api_key=X4rsMAfJU82yB7nQuDeD&start_date=" + start_date;
      let isEmpty = this.state.stocks.length === 0;
      let init = isEmpty ? [] : this.state.data;
      let _this = this;
      $.getJSON(url, function(json) {
        let res = json.dataset.data;
        for (let j = res.length - 1; j >= 0; j--) {
          if (isEmpty) {
            let newData = {
              "Date": res[j][0]
            };
            newData[name] = res[j][1];
            init.push(newData);
          } else if (res.length - 1 - j < init.length) {
            init[res.length - 1 - j][name] = res[j][1];
          }
          if (j === 0) {
            _this.setState({
              data: init,
              stocks: _this.state.stocks.concat(name)
            });
          }
        }
      }).fail(function() {
        axios.post('/deleteStock', {
          name: name
        })
      })
      functionLock = false;
    }
  }

  render() {
    const SimpleLineChart = (
      <LineChart width={1000} height={300} data={this.state.data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
        <XAxis dataKey="Date" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        {
          this.state.stocks.map((stock, idx) => {
            return (
              <Line key={idx} dot={false} type="monotone" dataKey={stock} stroke={idx < 3 ? this.getColor(idx) : this.getRandomColor()} />
            )
          })
        }
      </LineChart>
    );

    const jumbotronInstance = (
      <Jumbotron>
        {SimpleLineChart}
        <Add 
        handleInsert = {(name) => {
          this.addStock(name);
        }} 
        handleRange = {(range) => {
          this.changeRange(range);
        }}
        />
      </Jumbotron>
    );

    const listgroupInstance = (
      <ListGroup>
        {
          this.state.stocks.map((stock, idx) => {
            return (
              <Stock 
              key={idx}
              idx={idx}
              name={stock}
              handleDelete={(i) => {
                if (!functionLock) {
                  functionLock = true;
                  this.setState({
                    stocks: this.state.stocks.slice(0, i).concat(this.state.stocks.slice(i + 1))
                  });
                }
              }}
              />
            )
          })
        }
      </ListGroup>
    );

    return (
      <div>
        {jumbotronInstance}
        {listgroupInstance}
      </div>
    );
  }
}

export default Chart;
