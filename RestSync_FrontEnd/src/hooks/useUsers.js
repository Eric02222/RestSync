import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/user.service';
import { toast } from 'react-toastify';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      const errMsg = err.response?.data?.message || 'Falha ao carregar lista de usuários.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
};
