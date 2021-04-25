import { combineReducers } from 'redux';

import { SET_FILTER, SET_MOVIES, SET_USER, SET_SORT, TOGGLE_PW } from '../actions/actions';

function visibilityFilter(state = '', action) {
  switch (action.type) {
    case SET_FILTER:
      return action.value;
      default:
        return state;
  }
}

function movies(state = [], action) {
  switch (action.type) {
    case SET_MOVIES:
      return action.value;
      default:
        return state;
  }
}

function user( state = {
  Username: localStorage.getItem('username') ? localStorage.getItem('username') : '',
  Password: '',
  Email: '',
  Dob: '',
  // favoriteMovies: [],
  // movies: "",
}, action ) {
  switch (action.type) {
    case SET_USER:
      return action.value;
      default: 
      return state;
  }
}

function sort(state = false, action) {
switch(action.type) {
  case SET_SORT:
    return action.value;
    default :
    return state;
}
}
 
function tglpw(state = {
  type: 'password',
  word: 'Show'
}, action) {
  switch(action.type) {
    case TOGGLE_PW:
      return action.value;
      default: 
      return state;
  }
}
const moviesApp = combineReducers ({
 visibilityFilter,
    movies,
    user,
    sort,
    tglpw
  });


export default moviesApp;
