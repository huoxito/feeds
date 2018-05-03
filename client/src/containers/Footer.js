import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchNextPage } from "../actions";

const mapStateToProps = state => {
  return {
    ...state
  };
};
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, message: error.message });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <p className="red">something went wrong:</p>
          <pre>{this.state.message}</pre>
        </div>
      );
    }
    return this.props.children || null;
  }
}

class Footer extends Component {
  componentDidMount() {
    this.observer = new IntersectionObserver(this.fetchEvents);
  }

  fetchEvents = (entries, observer) => {
    this.props.dispatch(fetchNextPage(entries, this.props.path));
  };

  render() {
    if (this.props.starting || this.props.loading) {
      return null;
    }

    if (this.props.footerError) {
      return (
        <footer className="f7 h1 fw1 mt2 ph2 mb2">
          <p className="red">{this.props.footerError}</p>
        </footer>
      );
    }

    return (
      <footer
        ref={el => el && this.observer.observe(el)}
        className="f7 h1 fw1 mt2 ph2 mb2"
      >
        {this.props.loadingByFooter && <p>Loading older events ..</p>}
      </footer>
    );
  }
}

const FooterWrapper = props => (
  <ErrorBoundary>
    <Footer {...props} />
  </ErrorBoundary>
);

export default connect(mapStateToProps)(FooterWrapper);
