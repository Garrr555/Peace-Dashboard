/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import AdminDashboard from "../components/AdminDashboard";
import EmployeeDashboard from "../components/EmployeeDashboard";
import useCurrentUser from "../hooks/useCurrentUser";

const Dashboard = () => {
  const { currentUser } = useCurrentUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      if (currentUser) {
        setLoading(false);
      }
    }, 1000);
  }, [currentUser]);

  if (loading) return <Loading />;
  if (!currentUser)
    return (
      <p className="text-center text-slate-500">Failed to load dashboard</p>
    );
  if (currentUser?.role === "admin") {
    return <AdminDashboard {...currentUser} />;
  } else {
    return <EmployeeDashboard {...currentUser} />;
  }
};

export default Dashboard;
