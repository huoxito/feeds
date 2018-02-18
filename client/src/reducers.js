import * as types from './actions'
import update from 'immutability-helper'

export const initialState = {
  starting: true,
  path: '/',
  loading: true,
  enqueued: false,
  user: null,
  userOrganizations: [],
  userEvents: [],
  pages: {
    '/': [],
    '/pageNumber': 1
  },
  lastLoad: new Date(),
  error: null,
  footerError: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.RECEIVE_SESSION:
      return {
        ...state,
        starting: false,
        loading: false,
        user: action.user,
        userOrganizations: action.organizations || [],
        userEvents: action.userEvents,
        pages: {
          '/': action.list
        },
        lastLoad: new Date()
      }
    case types.SET_PATH:
      return {
        ...state,
        path: action.path,
        error: null,
        footerError: null
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
    case types.RECEIVE_EVENTS_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message
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
    case types.RECEIVE_NEXT_PAGE_FAILED:
      return {
        ...state,
        loadingByFooter: false,
        footerError: action.message
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

      const pageNumberKey = `${action.path}pageNumber`
      return {
        ...state,
        list: newCollection,
        pages: {
          ...state.pages,
          [action.path]: newCollection,
          [pageNumberKey]: (state.pages[pageNumberKey] || 1) + 1
        },
        loadingByFooter: false
      }
    default:
      return state
  }
}
