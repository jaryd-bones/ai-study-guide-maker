import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <section className="page">
      <h1>404 – Page Not Found</h1>
      <p>
        <Link to="/dashboard">Go back to dashboard</Link>
      </p>
    </section>
  );
}

export default NotFoundPage