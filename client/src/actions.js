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

export const REQUEST_NEXT_PAGE = 'REQUEST_NEXT_PAGE'
const requestNextPage = () => {
  return {
    type: REQUEST_NEXT_PAGE
  }
}

export const RECEIVE_NEXT_PAGE = 'RECEIVE_NEXT_PAGE'
const receiveNextPage = (list) => {
  return {
    type: RECEIVE_NEXT_PAGE,
    list
  }
}

export function fetchNextPage(entries) {
  return (dispatch, getState) => {
    const { list, feedsPath, page } = getState()
    entries.forEach(entry => {
      if (!list.length > 0 || !entry.isIntersecting) {
        return
      }

      dispatch(requestNextPage())

      const path = `/feeds${feedsPath}?page=${page + 1}`
      fetch(path, { method: 'GET', credentials: 'same-origin' })
        .then(
          response => response.json()
        )
        .then(
          body => dispatch(receiveNextPage(body.list))
        )
    })
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
    return wait(5000).then(
      () => dispatch(fetchEvents(feedsPath))
    )
  }
}

export function fetchEvents(feedsPath) {
  return (dispatch, getState) => {
    dispatch(requestEvents(feedsPath))

    const options = { method: 'GET', credentials: 'same-origin' }
    return fetch(`/feeds${feedsPath}`, options)
      .then(
        response => response.json(),
        error => console.log('shit')
      )
      .then(
        body => {
          const { list } = getState()
          const ids = list.map(e => e.id)
          const events = body.list.filter(e => ids.indexOf(e.id) === -1)

          if (events.length > 0) {
            dispatch(receiveEvents(feedsPath, events))
          }

          dispatch(enqueueEvents(feedsPath))
        }
      )
  }
}
