import React, { Component } from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { BrowserRouter as Router, Route } from "react-router-dom";

import reducer from "./reducers";
import Root from "./containers/Root";

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunkMiddleware))
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Route path="/:org?/:repo?" component={Root} />
        </Router>
      </Provider>
    );
  }
}

export default App;
