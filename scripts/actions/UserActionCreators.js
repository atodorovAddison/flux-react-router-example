'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    ActionTypes = require('../constants/ActionTypes'),
    UserAPI = require('../utils/UserAPI'),
    UserStore = require('../stores/UserStore'),
    StargazersByRepoStore = require('../stores/StargazersByRepoStore');

var UserActionCreators = {
  requestUser(login, fields) {
    if (UserStore.contains(login, fields)) {
      return;
    }

    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_USER,
      login: login
    });

    UserAPI.requestUser(login);
  },

  requestStargazerPage(fullName, isInitialRequest) {
    if (StargazersByRepoStore.isExpectingPage(fullName) ||
        StargazersByRepoStore.isLastPage(fullName)) {
      return;
    }

    if (isInitialRequest && StargazersByRepoStore.getPageCount(fullName) > 0) {
      return;
    }

    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_STARGAZER_PAGE,
      fullName: fullName
    });

    var nextPageUrl = StargazersByRepoStore.getNextPageUrl(fullName);
    UserAPI.requestStargazerPage(fullName, nextPageUrl);
  }
};

module.exports = UserActionCreators;