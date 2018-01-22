import * as types from './actions'
import update from 'immutability-helper'
import appLogo from './logo.png'

export const initialState = {
  starting: true,
  loading: true,
  enqueued: false,
  isAuthenticated: false,
  user: null,
  userEvents: [],
  list: [],
  lastLoad: new Date(),
  error: null,
  logo: appLogo,
  feedsName: 'Github Feeds',
  feedsPath: '',
  page: 1,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.RECEIVE_SESSION:
      return {
        ...state,
        starting: false,
        user: action.user,
        userEvents: action.userEvents,
        logo: action.user.avatar_url,
        feedsName: action.user.login,
        list: action.list,
        lastLoad: new Date(),
        isAuthenticated: true
      }
    case types.ENQUEUE_REQUESTS_EVENTS:
      return {
        ...state,
        enqueued: true
      }
    case types.REQUEST_EVENTS:
      return {
        ...state,
        loading: true,
        lastLoad: new Date(),
        enqueued: false
      }
    case types.RECEIVE_EVENTS:
      const feedsName = action.path || state.feedsName
      const list = update(state.list, { $unshift: action.list })

      return {
        ...state,
        feedsName,
        feedsPath: action.path,
        list: list.slice(0, 100),
        loading: false
      }
    case types.REQUEST_NEXT_PAGE:
      return {
        ...state,
        loadingByFooter: true
      }
    case types.RECEIVE_NEXT_PAGE:
      const length = state.list.length
      const lastId = state.list[length - 1].id
      const offsetEvent = action.list.find(e => e.id === lastId)
      const index = action.list.indexOf(offsetEvent)

      let newCollection = null

      if (index === -1) {
        newCollection = update(state.list, { $push: action.list })
      } else {
        const newEvents = action.list.slice(index + 1)
        newCollection = update(state.list, { $push: newEvents })
      }

      return {
        ...state,
        list: newCollection,
        page: state.page + 1,
        loadingByFooter: false
      }
    default:
      return state
  }
}
