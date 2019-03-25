import React, { Component } from "react";
import { connect } from "react-redux";
import NProgress from "nprogress";

import Placeholder from "./Placeholder";
import Wrapper from "./Wrapper";

import { enqueueRequestEvents, fetchEvents, fetchSession } from "../actions";

const mapStateToProps = ({ user }) => {
  return {
    user
  };
};

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

class Root extends Component {
  componentDidMount() {
    const { url } = this.props.match;
    this.props.dispatch(fetchSession(url));

    if (url !== "/") {
      this.props.dispatch(fetchEvents({ path: url }));
    }

    return wait(3 * 1000).then(this.enqueueEvents());
  }

  componentDidUpdate(prevProps) {
    const { match, user } = this.props;
    if (match.url === "/" && user === null) {
      return;
    }

    if (prevProps.user !== user || prevProps.match.url !== match.url) {
      NProgress.start();
      this.props.dispatch(fetchEvents({ path: match.url, urlUpdated: true }));
    }
  }

  enqueueEvents() {
    const time = 30;
    const { url } = this.props.match;
    this.props.dispatch(enqueueRequestEvents(url));

    return wait(time * 1000).then(() => {
      const { match, user } = this.props;

      wait(2 * 1000).then(() => this.enqueueEvents());
      if (match.url === "/" && user === null) {
        return;
      }

      this.props.dispatch(fetchEvents({ path: match.url }));
    });
  }

  render() {
    const { match, user } = this.props;
    if (match.url === "/" && user === null) {
      return <Placeholder path={match.url} />;
    }

    return (
      <div className="bg-washed-blue">
        <Wrapper path={match.url} />
      </div>
    );
  }
}

export default connect(mapStateToProps)(Root);
