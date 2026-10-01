/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import CustomFetch from "../config/db";
import type { UserType } from "../types/type";

const useUsers = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [userLength, setLength] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await CustomFetch.get("/users");

      setUsers(response.data.users);
      setLength(response.data.users.length);
    } catch (error: any) {
      console.error(error);

      setError(error?.response?.data?.message || "Gagal mengambil data users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return {
    users,
    userLength,
    loading,
    error,
    getUsers,
  };
};

export default useUsers;
