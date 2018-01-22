export const REQUEST_EVENTS = 'REQUEST_EVENTS'
const requestEvents = (path) => {
  return {
    type: REQUEST_EVENTS,
    path
  }
}

export const RECEIVE_EVENTS = 'RECEIVE_EVENTS'
const receiveEvents = (path, response) => {
  return {
    type: RECEIVE_EVENTS,
    path,
    ...response
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

export function fetchSession (feedsPath) {
  return (dispatch) => {
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

          dispatch(fetchEvents(feedsPath))
        }
      )
  }
}

export function enqueueEvents(feedsPath) {
  return (dispatch) => {
    dispatch(enqueueRequestEvents(feedsPath))

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
    return wait(15000).then(
      () => dispatch(fetchEvents(feedsPath))
    )
  }
}

export function fetchEvents(feedsPath) {
  return (dispatch) => {
    dispatch(requestEvents(feedsPath))

    const options = { method: 'GET', credentials: 'same-origin' }
    return fetch(`/feeds${feedsPath}`, options)
      .then(
        response => response.json(),
        error => console.log('shit')
      )
      .then(
        body => {
          dispatch(receiveEvents(feedsPath, body))

          if (body.isAuthenticated) {
          }

          dispatch(enqueueEvents(feedsPath))
        }
      )
  }
}
