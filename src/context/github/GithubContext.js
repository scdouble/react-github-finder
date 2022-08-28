import { createContext, useEffect, useState, useReducer } from 'react';
import { createRenderer } from 'react-dom/test-utils';
import githubReducer from './GithubReducer';

const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
  // const [users, setUsers] = useState([]);
  // const [loading, setLoading] = useState(true);

  const initialState = {
    users: [],
    user: {},
    loading: false,
    repos: [],
  };

  const [state, dispatch] = useReducer(githubReducer, initialState);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading();
    const response = await fetch(`${GITHUB_URL}/users`, {
      // headers: { Authorization : `token ${GITHUB_TOKEN}`}
    });
    const data = await response.json();

    // setUsers(data);
    // setLoading(false);

    dispatch({
      type: 'GET_USERS',
      payload: data,
    });
  };

  const searchUsers = async (text) => {
    const params = new URLSearchParams({
      q: text,
    });
    setLoading();
    const response = await fetch(`${GITHUB_URL}/search/users?${params}`, {
      // headers: { Authorization : `token ${GITHUB_TOKEN}`}
    });
    const { items } = await response.json();

    // setUsers(data);
    // setLoading(false);

    dispatch({
      type: 'GET_USERS',
      payload: items,
    });
  };

  const getUser = async (login) => {
    setLoading();

    const response = await fetch(`${GITHUB_URL}/users/${login}`, {
      // headers: { Authorization : `token ${GITHUB_TOKEN}`}
    });

    if (response.status === 404) {
      window.location = '/notfound';
    } else {
      const data = await response.json();
      dispatch({
        type: 'GET_USER',
        payload: data,
      });
    }
  };

  const getUserRepos = async (login) => {
    setLoading();

    const params = new URLSearchParams({
      sort: 'created',
      per_page: 10,
    });

    const response = await fetch(`${GITHUB_URL}/users/${login}/repos?${params}`, {
      // headers: { Authorization : `token ${GITHUB_TOKEN}`}
    });
    const data = await response.json();

    dispatch({
      type: 'GET_REPOS',
      payload: data,
    });
  };

  const clearUsers = () => {
    dispatch({ type: 'CLEAR_USERS' });
  };

  const setLoading = () => {
    return dispatch({
      type: 'SET_LOADING',
    });
  };
  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        loading: state.loading,
        repos: state.repos,
        fetchUsers,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
