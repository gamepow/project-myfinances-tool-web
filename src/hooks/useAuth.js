import { useUser } from '../context/UserContext';
import { useCallback } from 'react';

const useAuth = () => {
  const { logout } = useUser();

  const fetchWithAuth = useCallback(
    async (url, options = {}) => {
      const token = localStorage.getItem('token');
      const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };

      const apiUrl = url.startsWith('http')
        ? url
        : `${process.env.REACT_APP_API_URL}${url}`;

      const response = await fetch(apiUrl, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        logout();
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      return { status: response.status, data };
    },
    [logout]
  );

  return fetchWithAuth;
};

export default useAuth;