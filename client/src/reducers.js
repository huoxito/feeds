import * as types from "./actions";
import update from "immutability-helper";

export const initialState = {
  firstLoad: true,
  loading: true,
  enqueued: false,
  needsAuth: null,
  user: null,
  userOrganizations: [],
  userEvents: [],
  isAuthenticated: false,
  pages: {
    "/": [],
    "/pageNumber": 1
  },
  lastLoad: new Date(),
  error: null,
  footerError: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.RECEIVE_SESSION:
      return {
        ...state,
        loading: true,
        user: action.user,
        needsAuth: !action.user,
        isAuthenticated: !!action.user,
        userOrganizations: action.organizations || [],
        userEvents: action.userEvents,
        lastLoad: new Date()
      };
    case types.ENQUEUE_REQUESTS_EVENTS:
      return {
        ...state,
        loading: false,
        enqueued: true
      };
    case types.REQUEST_EVENTS:
      return {
        ...state,
        lastLoad: new Date(),
        enqueued: false,
        loading: action.loading,
        urlUpdated: action.urlUpdated
      };
    case types.RECEIVE_EVENTS_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message
      };
    case types.RECEIVE_EVENTS:
      const list = state.pages[action.path] || [];
      const updatedList = update(list, { $unshift: action.list });

      const common = {
        ...state,
        firstLoad: false,
        isAuthenticated: action.isAuthenticated,
        loading: false,
        urlUpdated: false
      };

      if (state.isAuthenticated && !action.isAuthenticated) {
        return {
          ...common,
          isAuthenticated: action.isAuthenticated,
          loggedOut: true,
          error: "Lost connection, please sign in again"
        };
      }

      return {
        ...common,
        pages: {
          ...state.pages,
          [action.path]: updatedList.slice(0, 100)
        },
        error: null
      };
    case types.REQUEST_NEXT_PAGE:
      return {
        ...state,
        loadingByFooter: true
      };
    case types.RECEIVE_NEXT_PAGE_FAILED:
      return {
        ...state,
        loadingByFooter: false,
        footerError: action.message
      };
    case types.RECEIVE_NEXT_PAGE:
      const page = state.pages[action.path];
      const length = page.length;
      const lastId = page[length - 1].id;
      const offsetEvent = action.list.find(e => e.id === lastId);
      const index = action.list.indexOf(offsetEvent);

      let newCollection = null;

      if (index === -1) {
        newCollection = update(page, { $push: action.list });
      } else {
        const newEvents = action.list.slice(index + 1);
        newCollection = update(page, { $push: newEvents });
      }

      const pageNumberKey = `${action.path}pageNumber`;
      return {
        ...state,
        list: newCollection,
        pages: {
          ...state.pages,
          [action.path]: newCollection,
          [pageNumberKey]: (state.pages[pageNumberKey] || 1) + 1
        },
        loadingByFooter: false
      };
    default:
      return state;
  }
};
