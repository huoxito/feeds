import React, { Component } from "react";
import { connect } from "react-redux";
import NProgress from "nprogress";

import Placeholder from "./Placeholder";
import Lists from "./Lists";
import Header from "./Header";
import Footer from "./Footer";

import { enqueueRequestEvents, fetchEvents, fetchSession } from "../actions";

const mapStateToProps = ({ firstLoad, user, needsAuth }) => {
  return {
    firstLoad,
    user,
    needsAuth
  };
};

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

class App extends Component {
  componentDidMount() {
    const { url } = this.props.match;
    this.props.dispatch(fetchSession(url));
    return wait(3 * 1000).then(this.enqueueEvents());
  }

  componentDidUpdate() {
    const { match, user } = this.props;
    if (match.url === "/" && user === null) {
      return;
    }

    NProgress.start();
    this.props.dispatch(fetchEvents({ path: match.url, urlUpdated: true }));
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
    const { match, firstLoad, user } = this.props;
    if (firstLoad || (match.url === "/" && user === null)) {
      return <Placeholder path={match.url} />;
    }

    return (
      <div className="bg-washed-blue">
        <div className="helvetica w-80-ns w-100 mh3-ns">
          <Header />
          <Lists path={match.url} />
          <Footer path={match.url} />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
