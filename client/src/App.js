import React, { Component } from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { BrowserRouter as Router, Route } from "react-router-dom";

import reducer from "./reducers";
import App from "./containers/App";

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunkMiddleware))
);

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Route path="/:org?/:repo?" component={App} />
        </Router>
      </Provider>
    );
  }
}

export default Root;
