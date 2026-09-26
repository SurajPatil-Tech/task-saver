import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <p className="text-8xl font-extrabold text-blue-600">404</p>

        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Page Not Found
        </h1>

        <p className="mt-3 text-gray-500 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-block mt-6 rounded-lg bg-blue-600 px-6 py-3
                     font-medium text-white transition hover:bg-blue-700"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;