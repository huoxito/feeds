import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import { withRouter } from "react-router-dom";

import appLogo from "../logo.png";
import SignInButton from "../components/SignInButton";

const trimSlashes = string => {
  const value = string.trim();
  if (value[0] === "/") {
    return trimSlashes(value.slice(1));
  } else if (value[value.length - 1] === "/") {
    return trimSlashes(value.slice(0, -1));
  } else {
    return value;
  }
};

const mapStateToProps = ({ user, lastLoad, enqueued }) => {
  return {
    user,
    enqueued,
    lastLoad
  };
};

class Header extends Component {
  state = {
    inputValue: this.props.match.url.substr(1),
    redirect: false
  };

  onChange = e => {
    e.preventDefault();
    this.setState({ inputValue: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const url = trimSlashes(this.state.inputValue);
    this.setState({ inputValue: url });

    if (`/${url}` !== this.props.match.url) {
      this.setState({ redirect: true });
    }
  };

  onBlur = () => {
    this.setState({ inputValue: this.props.match.url.substr(1) });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.match.url !== nextProps.match.url) {
      this.setState({ redirect: false });
    }

    if (`/${this.state.inputValue}` !== this.props.match.url) {
      this.setState({ inputValue: this.props.match.url.substr(1) });
    }
  }

  render() {
    const { user, lastLoad, enqueued } = this.props;

    if (this.state.redirect) {
      return <Redirect to={`/${this.state.inputValue}`} />;
    }

    return (
      <header className="relative pv2 bb b--black-10 h-100">
        <Link to="/" className="link black">
          <img
            src={appLogo}
            title="github feeds"
            alt="github feeds"
            className="br3 h2 w2 dib pr3 pl3"
          />
        </Link>

        <div className="dib w-60">
          <form className="mw7 center br2-ns" onSubmit={this.onSubmit}>
            <div className="flex">
              <p className="dib pa1 ma0">/ </p>
              <input
                className="f6 bn pa2 black-80 bg-white w-100 w-75-m w-80-l br2-ns br--left-ns"
                placeholder=":user/:repo"
                type="text"
                onChange={this.onChange}
                onBlur={this.onBlur}
                name="feed"
                value={this.state.inputValue}
              />

              <input className="dn" type="submit" value="search" />
            </div>
          </form>
        </div>

        <div className="dib absolute right-0">{!user && <SignInButton />}</div>

        {user && (
          <span className="dbi f7 fw1 absolute mv2 mh2 bottom-0 right-0">
            <span className={`di-ns dn ${!enqueued && "underline"}`}>
              {lastLoad.toTimeString()}
            </span>
          </span>
        )}
      </header>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Header));
