import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import { withRouter } from "react-router-dom";

import appLogo from "../logo.png";
import SignInButton from "../components/SignInButton";

const trimSlashes = string => {
  const [user, repo] = string.split("/");

  if (repo) {
    return `${user.trim()}/${repo.trim()}`;
  } else {
    return user.trim() || "";
  }
};

const buildDisplayValue = input => {
  if (input[input.length - 1] === "/") {
    return `${input.slice(0, -1)} / `;
  }

  if (input[input.length - 1] === " ") {
    return `${input.slice(0, -1)} / `;
  }

  const [user, repo] = input.split("/");

  if (repo) {
    return `${user.trim()} / ${repo.trim()}`;
  } else {
    return user.trim() || "";
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
    inputValue: buildDisplayValue(this.props.match.url.substr(1)),
    redirect: false
  };

  onChange = e => {
    e.preventDefault();
    const inputValue = e.target.value;
    this.setState({ inputValue });
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
    this.setState({
      inputValue: buildDisplayValue(this.props.match.url.substr(1))
    });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.match.url !== nextProps.match.url) {
      this.setState({ redirect: false });
    }

    if (`/${this.state.inputValue}` !== this.props.match.url) {
      this.setState({
        inputValue: buildDisplayValue(this.props.match.url.substr(1))
      });
    }
  }

  render() {
    const { user } = this.props;

    if (this.state.redirect) {
      return <Redirect to={`/${this.state.inputValue}`} />;
    }

    return (
      <header className="flex pv2 bb b--black-10 h-100">
        <Link to="/" className="link black">
          <img
            src={appLogo}
            title="github feeds"
            alt="github feeds"
            className="br3 h2 w2 dib pr3 pl3"
          />
        </Link>

        <div className="w-100 mt1">
          <form className="br2-ns pr1" onSubmit={this.onSubmit}>
            <div className="flex">
              <input
                className="f6 bn pa2 black-80 w-100 bg-white br2-ns br--left-ns"
                placeholder="user / repo"
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

        {!user && (
          <div className="w-25 self-end">
            <SignInButton />
          </div>
        )}
      </header>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Header));
