import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div style={{ padding: "20px", color: "black" }}>
      <h1>Landing Page</h1>
      <p>Welcome to our app</p>
      <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
    </div>
  );
};

export default Landing;
