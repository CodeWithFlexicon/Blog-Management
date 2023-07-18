import { useContext } from "react";
import { Link, Form, Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function Signup() {
  const { currentUser, signup, authError } = useContext(AuthContext);
  if (currentUser) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const credentials = Object.fromEntries(formData);
    await signup(credentials);
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-blue-900 shadow-md rounded px-8 py-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

        {authError && <div className="text-red-500">{authError}</div>}

        <Form method="post" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign Up
            </button>
            <Link
              to="/login"
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            >
              Already have an account? Login
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
