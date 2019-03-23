import NProgress from "nprogress";

export const REQUEST_EVENTS = "REQUEST_EVENTS";
const requestEvents = ({ path, loading, urlUpdated }) => {
  return {
    type: REQUEST_EVENTS,
    path,
    loading,
    urlUpdated
  };
};

export const RECEIVE_EVENTS = "RECEIVE_EVENTS";
const receiveEvents = (path, list, isAuthenticated) => {
  return {
    type: RECEIVE_EVENTS,
    path,
    list,
    isAuthenticated
  };
};

export const RECEIVE_EVENTS_FAILED = "RECEIVE_EVENTS_FAILED";
const receiveEventsFailed = message => {
  return {
    type: RECEIVE_EVENTS_FAILED,
    message
  };
};

export const ENQUEUE_REQUESTS_EVENTS = "ENQUEUE_REQUESTS_EVENTS";
export const enqueueRequestEvents = path => {
  return {
    type: ENQUEUE_REQUESTS_EVENTS,
    path
  };
};

export const REQUEST_SESSION = "REQUEST_SESSION";
const requestSession = body => {
  return {
    type: REQUEST_SESSION
  };
};

export const RECEIVE_SESSION = "RECEIVE_SESSION";
const receiveSession = body => {
  return {
    type: RECEIVE_SESSION,
    ...body
  };
};

export const REQUEST_NEXT_PAGE = "REQUEST_NEXT_PAGE";
const requestNextPage = () => {
  return {
    type: REQUEST_NEXT_PAGE
  };
};

export const RECEIVE_NEXT_PAGE_FAILED = "RECEIVE_NEXT_PAGE_FAILED";
const receiveNextPageFailed = message => {
  return {
    type: RECEIVE_NEXT_PAGE_FAILED,
    message
  };
};

export const RECEIVE_NEXT_PAGE = "RECEIVE_NEXT_PAGE";
const receiveNextPage = (list, path) => {
  return {
    type: RECEIVE_NEXT_PAGE,
    list,
    path
  };
};

export function fetchNextPage(entries, path) {
  return (dispatch, getState) => {
    const { pages, userOrganizations, user } = getState();

    entries.forEach(entry => {
      const events = [].concat(...Object.values(pages));
      if (!entry.isIntersecting || !events.length) {
        return;
      }

      dispatch(requestNextPage());

      const privateList =
        (user && path.substr(1) === user.login) ||
        userOrganizations.indexOf(path.substr(1)) !== -1;

      const urlPath = `/feeds${path}${(privateList && "-p") || ""}`;
      const url = `/${urlPath}?page=${pages[`${path}pageNumber`] || 2}`;
      fetch(url, { method: "GET", credentials: "same-origin" })
        .then(response => response.json())
        .then(body => {
          if (body.error) {
            throw new Error(body.error);
          } else {
            dispatch(receiveNextPage(body.list, path));
          }
        })
        .catch(error => dispatch(receiveNextPageFailed(error.message)));
    });
  };
}

export function fetchSession(path) {
  return async (dispatch, getState) => {
    dispatch(requestSession());

    const options = { method: "GET", credentials: "same-origin" };
    const response = await fetch("/me", options).then(res => res.json());
    if (!response.error) {
      dispatch(receiveSession(response));
    }
  };
}

class OrgNotFoundError extends Error {}

export function fetchEvents({ path, urlUpdated }) {
  return (dispatch, getState) => {
    const { pages, user, userOrganizations, loggedOut } = getState();

    if (loggedOut) {
      return;
    }

    const list = pages[path] || [];
    dispatch(requestEvents({ path, urlUpdated, loading: list.length === 0 }));

    const privateList =
      (user && path.substr(1) === user.login) ||
      userOrganizations.indexOf(path.substr(1)) !== -1;

    const urlPath = `/feeds${path}${(privateList && "-p") || ""}`;
    const options = { method: "GET", credentials: "same-origin" };
    return fetch(urlPath, options)
      .then(
        response => {
          if (response.status === 404) {
            throw new OrgNotFoundError(`${path} not found`);
          }

          return response.json();
        },
        error => console.log(error)
      )
      .then(body => {
        const { pages } = getState();
        const list = pages[path] || [];
        const ids = list.map(e => e.id);
        const events = body.list.filter(e => ids.indexOf(e.id) === -1);
        const isAuthenticated = body.isAuthenticated;

        dispatch(receiveEvents(path, events, isAuthenticated));
        NProgress.done();
      })
      .catch(error => {
        NProgress.done();
        dispatch(receiveEventsFailed(error.message));
      });
  };
}
