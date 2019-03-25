import * as React from "react";
import { connect } from "react-redux";

import Lists from "./Lists";
import Header from "./Header";
import Footer from "./Footer";

import ErrorBanner from "../components/ErrorBanner";

const mapStateToProps = ({ error }) => {
  return {
    error
  };
};

const Wrapper = ({ error, path }) => {
  return (
    <React.Fragment>
      <ErrorBanner message={error} />
      <div className={`helvetica w-80-ns w-100 mh3-ns ${error && "o-10"}`}>
        <Header />
        <Lists path={path} />
        <Footer path={path} />
      </div>
    </React.Fragment>
  );
};

export default connect(mapStateToProps)(Wrapper);
