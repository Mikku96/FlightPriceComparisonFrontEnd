import { useRouteError, Link } from "react-router-dom";

export default function Errorpage() {
  const error = useRouteError();

  return (
    <div className="ErrorPage min-h-screen">
      {error.status === 404 ? (
        <p>
          404: {error.message !== undefined ? error.message : "Page not found"}
        </p>
      ) : (
        <p>something Unexpected happened!</p>
      )}
      <Link to={"/"}>Go back</Link>
    </div>
  );
}
