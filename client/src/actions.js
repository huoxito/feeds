export const REQUEST_EVENTS = 'REQUEST_EVENTS'
const requestEvents = (path) => {
  return {
    type: REQUEST_EVENTS,
    path
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

export const ENQUEUE_REQUESTS_EVENTS = 'ENQUEUE_REQUESTS_EVENTS'
const enqueueRequestEvents = (path) => {
  return {
    type: ENQUEUE_REQUESTS_EVENTS,
    path
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
    return fetch(feedsPath, options)
      .then(
        response => response.json(),
        error => console.log('shit')
      )
      .then(
        body => {
          dispatch(receiveEvents(feedsPath, body))
          dispatch(enqueueEvents(feedsPath))
        }
      )
  }
}
