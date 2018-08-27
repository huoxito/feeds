import React, { Component } from "react";
import { connect } from "react-redux";

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

class App extends Component {
  componentDidMount() {
    const { url } = this.props.match;
    this.props.dispatch(fetchSession(url));
    console.log("---------- componentDidMount");
  }

  componentDidUpdate() {
    console.log("---------- componentDidUpdate");

    const { url } = this.props.match;
    const { firstLoad, user, needsAuth } = this.props;
    console.log({ url, user, needsAuth, firstLoad });

    if (url === "/" && user === null) {
      return;
    }

    this.props.dispatch(fetchEvents(url));

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    return wait(3 * 1000).then(this.enqueueEvents());
  }

  enqueueEvents() {
    console.log("---------- enqueueEvents");
    const time = 30;
    const { url } = this.props.match;
    this.props.dispatch(enqueueRequestEvents(url));

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    return wait(time * 1000).then(() => {
      const { url } = this.props.match;
      this.props.dispatch(fetchEvents(url));
      wait(2 * 1000).then(() => this.enqueueEvents());
    });
  }

  render() {
    const { match, firstLoad, user } = this.props;
    if (firstLoad || (match.url === "/" && user === null)) {
      return <Placeholder path={match.url} />;
    }

    return (
      <div className="helvetica w-80-ns w-100 mh3-ns">
        <Header />
        <Lists path={match.url} />
        <Footer path={match.url} />
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
