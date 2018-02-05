export const REQUEST_EVENTS = 'REQUEST_EVENTS'
const requestEvents = (path, loading = false) => {
  return {
    type: REQUEST_EVENTS,
    path,
    loading
  }
}

export const RECEIVE_EVENTS = 'RECEIVE_EVENTS'
const receiveEvents = (path, list) => {
  return {
    type: RECEIVE_EVENTS,
    path,
    list
  }
}

export const RECEIVE_EVENTS_FAILED = 'RECEIVE_EVENTS_FAILED'
const receiveEventsFailed = (message) => {
  return {
    type: RECEIVE_EVENTS_FAILED,
    message
  }
}

export const REQUEST_EVENTS_FAILED = 'REQUEST_EVENTS_FAILED'
const requestEventsFailed = (message) => {
  return {
    type: REQUEST_EVENTS_FAILED,
    message
  }
}

export const ENQUEUE_REQUESTS_EVENTS = 'ENQUEUE_REQUESTS_EVENTS'
const enqueueRequestEvents = (path) => {
  return {
    type: ENQUEUE_REQUESTS_EVENTS,
    path
  }
}

export const REQUEST_SESSION = 'REQUEST_SESSION'
const requestSession = (body) => {
  return {
    type: REQUEST_SESSION
  }
}

export const RECEIVE_SESSION = 'RECEIVE_SESSION'
const receiveSession = (body) => {
  return {
    type: RECEIVE_SESSION,
    ...body
  }
}

export const SET_PATH = 'SET_PATH'
const setPath = (path) => {
  return {
    type: SET_PATH,
    path
  }
}

export const REQUEST_NEXT_PAGE = 'REQUEST_NEXT_PAGE'
const requestNextPage = () => {
  return {
    type: REQUEST_NEXT_PAGE
  }
}

export const RECEIVE_NEXT_PAGE = 'RECEIVE_NEXT_PAGE'
const receiveNextPage = (list, path) => {
  return {
    type: RECEIVE_NEXT_PAGE,
    list,
    path
  }
}

export function fetchNextPage(entries) {
  return (dispatch, getState) => {
    const { pages, path, page } = getState()

    entries.forEach(entry => {
      const events = [].concat(...Object.values(pages))
      if (!entry.isIntersecting || !events.length) {
        return
      }

      dispatch(requestNextPage())

      const url = `/feeds${path}?page=${page + 1}`
      fetch(url, { method: 'GET', credentials: 'same-origin' })
        .then(
          response => response.json()
        )
        .then(
          body => dispatch(receiveNextPage(body.list, path))
        )
    })
  }
}

export function fetchSession (path) {
  return (dispatch, getState) => {
    dispatch(setPath(path))
    dispatch(requestSession())

    const options = { method: 'GET', credentials: 'same-origin' }
    fetch('/me', options)
      .then(
        response => response.json()
      )
      .then(
        body => {
          if (!body.error) {
            dispatch(receiveSession(body))
          }

          const { path } = getState()
          dispatch(fetchEvents(path))
        }
      )
  }
}

export function enqueueEvents(path, time = 20) {
  return (dispatch, getState) => {
    dispatch(enqueueRequestEvents(path))

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
    return wait(time * 1000).then(
      () => {
        const { path: currentPath } = getState()
        if (currentPath !== path) {
          return
        }
        dispatch(fetchEvents(path))
      }
    )
  }
}
class OrgNotFoundError extends Error {}

export function fetchEvents(path) {
  return (dispatch, getState) => {
    const { pages } = getState()
    const list = pages[path] || []
    dispatch(requestEvents(path, list.length === 0))

    const options = { method: 'GET', credentials: 'same-origin' }
    return fetch(`/feeds${path}`, options)
      .then(
        response => {
          if (response.status === 404) {
            throw new OrgNotFoundError(`${path} not found`)
          }

          return response.json()
        },
        error => console.log('shit')
      )
      .then(
        body => {
          const { pages } = getState()
          const list = pages[path] || []
          const ids = list.map(e => e.id)
          const events = body.list.filter(e => ids.indexOf(e.id) === -1)

          if (events.length > 0) {
            dispatch(receiveEvents(path, events))
          }

          dispatch(enqueueEvents(path))
        }
      )
      .catch(
        error => {
          if (error instanceof OrgNotFoundError) {
          } else {
            dispatch(enqueueEvents(path, 60))
          }

          dispatch(receiveEventsFailed(error.message))
        }
      )
  }
}

export function switchEventsList(path) {
  return (dispatch) => {
    dispatch(setPath(path))
    dispatch(fetchEvents(path))
  }
}
