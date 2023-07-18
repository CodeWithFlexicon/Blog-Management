import { useContext, useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useNavigation,
  useLoaderData,
  Form,
  redirect,
} from "react-router-dom";
import classNames from "classnames";
import { AuthContext } from "../contexts/AuthContext";
import { FaBlogger } from "react-icons/fa";

export async function loader({ request }) {
  const response = await fetch("/blog/auth/current_user");
  if (response.ok) {
    const { user } = await response.json();
    return { currentUser: user };
  } else {
    return { currentUser: null };
  }
}

function Root() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const outletClasses = classNames(
    "mx-auto max-w-4xl sm:px-12 px-4 transition-opacity",
    {
      "opacity-100": navigation.state !== "loading",
      "opacity-50": navigation.state === "loading",
    }
  );

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    alert("You have been logged out successfully");
    redirect("/login");
  };

  const renderAuthButtons = () => {
    if (currentUser) {
      return (
        <Form method="post" onSubmit={handleLogout}>
          <button
            type="submit"
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </Form>
      );
    } else {
      return (
        <>
          <Link
            to="/signup"
            className="text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Signup
          </Link>
          <Link
            to="/login"
            className="text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </Link>
        </>
      );
    }
  };

  return (
    <div>
      <nav className="bg-blue-900 h-14 flex items-center justify-between px-4">
        <h2 className="flex items-center text-white text-2xl">
          <Link to="/" className="flex items-center gap-1">
            <FaBlogger />
            Your Blog Manager
          </Link>
        </h2>
        <div className="flex items-center">{renderAuthButtons()}</div>
      </nav>

      <div className={outletClasses}>
        <Outlet />
      </div>
    </div>
  );
}

export default Root;
