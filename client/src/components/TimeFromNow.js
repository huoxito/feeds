import moment from "moment";
import React, { Component } from "react";

// Copied from https://gist.github.com/aortbals/48fa1e3526e42698f24dc58c2f03bf74
//
export default class TimeFromNow extends Component {
  componentDidMount() {
    const interval = 10000;
    this.interval = setInterval(() => this.forceUpdate(), interval);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    const { timestamp } = this.props;
    const time = moment.utc(timestamp.replace(" UTC", ""));
    return <span title={time.toDate()}>{moment(time).fromNow()}</span>;
  }
}
