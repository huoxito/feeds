import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const mapStateToProps = ({ needsAuth }) => ({ needsAuth });

const Placeholder = ({ needsAuth, path }) => (
  <section className="vh-100 bg-washed-blue baskerville">
    <header className="tc ph5 lh-copy">
      <h1 className="f1 f-headline-l code mb3 fw9 dib tracked-tight">
        github feeds
      </h1>

      <h2 className="tc f1-l fw1">
        {needsAuth && path === "/"
          ? "looks like you're not authenticated"
          : "waking up, hang on"}
      </h2>
    </header>

    {needsAuth &&
      path === "/" && (
        <p className="fw1 ph2 i tc mt4 mt5-l f4 f3-l">
          <a href="/auth" className="link blue">
            Sign in via github
          </a>{" "}
          or search for an organization or user. e.g.{" "}
          <Link to="/rails" className="link blue">
            rails
          </Link>,{" "}
          <Link to="/facebook/react" className="link blue">
            facebook / react
          </Link>
        </p>
      )}
  </section>
);

export default connect(mapStateToProps)(Placeholder);
