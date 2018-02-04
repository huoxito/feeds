import * as types from './actions'
import update from 'immutability-helper'
import appLogo from './logo.png'

export const initialState = {
  starting: true,
  path: '/',
  loading: true,
  enqueued: false,
  isAuthenticated: false,
  user: null,
  userEvents: [],
  pages: { '/': [] },
  lastLoad: new Date(),
  error: null,
  logo: appLogo,
  page: 1
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.RECEIVE_SESSION:
      return {
        ...state,
        starting: false,
        loading: false,
        user: action.user,
        userEvents: action.userEvents,
        logo: action.user.avatar_url,
        pages: {
          '/': action.list
        },
        lastLoad: new Date(),
        isAuthenticated: true
      }
    case types.SET_PATH:
      return {
        ...state,
        path: action.path
      }
    case types.ENQUEUE_REQUESTS_EVENTS:
      return {
        ...state,
        loading: false,
        enqueued: true
      }
    case types.REQUEST_EVENTS:
      return {
        ...state,
        lastLoad: new Date(),
        enqueued: false,
        loading: action.loading
      }
    case types.RECEIVE_EVENTS:
      const list = state.pages[action.path] || []
      const updatedList = update(list, { $unshift: action.list })

      return {
        ...state,
        pages: {
          ...state.pages,
          [action.path]: updatedList.slice(0, 100)
        },
        loading: false
      }
    case types.REQUEST_NEXT_PAGE:
      return {
        ...state,
        loadingByFooter: true
      }
    case types.RECEIVE_NEXT_PAGE:
      const page = state.pages[action.path]
      const length = page.length
      const lastId = page[length - 1].id
      const offsetEvent = action.list.find(e => e.id === lastId)
      const index = action.list.indexOf(offsetEvent)

      let newCollection = null

      if (index === -1) {
        newCollection = update(page, { $push: action.list })
      } else {
        const newEvents = action.list.slice(index + 1)
        newCollection = update(page, { $push: newEvents })
      }

      return {
        ...state,
        list: newCollection,
        pages: {
          ...state.pages,
          [action.path]: newCollection.slice(0, 100)
        },
        page: state.page + 1,
        loadingByFooter: false
      }
    default:
      return state
  }
}
