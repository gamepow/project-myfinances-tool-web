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

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      return response.json();
    },
    [logout]
  );

  return fetchWithAuth;
};

export default useAuth;