import { Link, Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div>
      <h1 style={{ color: "black" }}>Dashboard</h1>

      <nav>
        <Link to="/dashboard">Home</Link> |{" "}
        <Link to="/dashboard/analytics">Analytics</Link> |{" "}
        <Link to="/dashboard/reviews">Reviews</Link> |{" "}
        <Link to="/dashboard/settings">Settings</Link>
      </nav>

      <hr />

      <Outlet style={{ color: "black" }} />
    </div>
  );
};

export default DashboardLayout;
