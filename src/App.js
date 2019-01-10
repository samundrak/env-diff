import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Row, Col, Button, Input, message } from 'antd';
const { TextArea } = Input;

class App extends Component {
  constructor() {
    super();
    this.state = {
      old: '',
      latest: '',
      diff: '',
      displayType: '',
    };
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }
  getEnv(string) {
    if (!string) return [];
    return string.trim().split('\n');
  }
  handleClick(type) {
    return () => {
      const { old, latest } = this.state;
      if (!old || !latest) {
        return message.error('Please fill both side.');
      }
      const withValues = new Map();
      const oldEnvs = this.getEnv(old).map((item) => {
        const [key, value] = item.split('=');
        withValues.set(key, value);
        return key;
      });
      const latestEnvs = this.getEnv(latest).map((item) => item.split('=')[0]);
      const unique = oldEnvs.filter((key) => {
        return !latestEnvs.includes(key);
      });
      const diffs = [];
      const json = {};
      unique.forEach((key) => {
        if (type === 'key') {
          diffs.push(`${key}`);
        }
        if (type === 'key-value') {
          diffs.push(`${key}=${withValues.get(key)}`);
        }
        if (type === 'json') {
          json[key] = withValues.get(key);
        }
      });
      this.setState({
        displayType: type,
        diff:
          type === 'json' ? JSON.stringify(json, null, 2) : diffs.join('\n'),
      });
    };
  }
  render() {
    const { old, latest, diff } = this.state;
    return (
      <div className="App">
        <Row>
          <Col span={12}>
            <b>Old ({this.getEnv(old).length})</b>
            <TextArea
              value={this.state.old}
              onChange={this.handleChange.bind(this)}
              name="old"
              rows="15"
            />
          </Col>
          <Col span={12}>
            <b>New ({this.getEnv(latest).length})</b>
            <TextArea
              value={this.state.latest}
              onChange={this.handleChange.bind(this)}
              rows="15"
              name="latest"
            />
          </Col>
        </Row>
        <Row>
          <Col span={12} offset={12}>
            <Button onClick={this.handleClick.bind(this)('key')}>
              Key only
            </Button>
            <Button onClick={this.handleClick.bind(this)('key-value')}>
              Key and value
            </Button>
            <Button onClick={this.handleClick.bind(this)('json')}>
              Print as JSON
            </Button>
          </Col>
        </Row>
        <Row>
          <b>
            Diff (
            {(this.state.displayType !== 'json' && this.getEnv(diff).length) ||
              0}
            )
          </b>
          <TextArea
            value={this.state.diff}
            onChange={this.handleChange.bind(this)}
            name="diff"
            rows="50"
          />
        </Row>
      </div>
    );
  }
}

export default App;
