import React, { Component } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import Lists from './containers/Lists'
import Header from './containers/Header'
import Footer from './containers/Footer'
import reducer from './reducers'
import { fetchSession } from './actions'

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
    const args = window.location.pathname.split('/').filter(e => e)
    const feedsPath = (args.length > 0 && `/${args.join('/')}`) || ''
    store.dispatch(fetchSession(feedsPath))
  }

  render () {
    return (
      <Provider store={store}>
        <div className='helvetica w-80-ns w-100 mh3-ns'>
          <Header />
          <Lists />
          <Footer />
        </div>
      </Provider>
    )
  }
}

export default App
