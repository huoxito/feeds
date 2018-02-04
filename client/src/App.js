import React, { Component } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import Lists from './containers/Lists'
import Header from './containers/Header'
import Footer from './containers/Footer'
import reducer from './reducers'
import { fetchSession, switchEventsList } from './actions'

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(
      thunkMiddleware
    )
  )
)

class App extends Component {
  componentDidMount () {
    const { url } = this.props.match
    store.dispatch(fetchSession(url))
  }

  componentDidUpdate () {
    const { url } = this.props.match
    store.dispatch(switchEventsList(url))
  }

  render () {
    return (
      <div className='helvetica w-80-ns w-100 mh3-ns'>
        <Header />
        <Lists />
        <Footer />
      </div>
    )
  }
}

class Root extends Component {
  render () {
    return (
      <Provider store={store}>
        <Router>
          <Route path='/:org?/:repo?' component={App} />
        </Router>
      </Provider>
    )
  }
}

export default Root
