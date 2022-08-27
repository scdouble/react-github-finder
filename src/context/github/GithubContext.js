import { createContext, useEffect, useState, useReducer } from 'react';
import githubReducer from './GithubReducer';

const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
  // const [users, setUsers] = useState([]);
  // const [loading, setLoading] = useState(true);

  const initialState = {
    users: [],
    loading: false,
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
      q : text
    })
    setLoading();
    const response = await fetch(`${GITHUB_URL}/search/users?${params}`, {
      // headers: { Authorization : `token ${GITHUB_TOKEN}`}
    });
    const {items } = await response.json();

    // setUsers(data);
    // setLoading(false);

    dispatch({
      type: 'GET_USERS',
      payload: items,
    });
  };

  const clearUsers = () => {
    dispatch({type:'CLEAR_USERS'})
  }

  const setLoading = () => {
    return dispatch({
      type: 'SET_LOADING',
    });
  };
  return (
    <GithubContext.Provider value={{ users: state.users, loading: state.loading, fetchUsers,searchUsers,clearUsers }}>
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
