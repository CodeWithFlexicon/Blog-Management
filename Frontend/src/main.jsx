import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import ErrorPage from "./ErrorPage";
import Root, {
  loader as rootLoader,
  action as logoutAction,
} from "./routes/root";
import AuthProvider from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login, { action as loginAction } from "./routes/auth/Login";
import { LogoutMessageProvider } from "./contexts/LogoutContext";
import Signup, { action as signupAction } from "./routes/auth/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <LogoutMessageProvider>
        <Root />
      </LogoutMessageProvider>
    ),
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: logoutAction,
    children: [
      /* {
        index: true,
        element: (
          <ProtectedRoute>
            <PostList />
          </ProtectedRoute>
        ),
      }, */
      {
        path: "/login",
        element: <Login />,
        action: loginAction,
      },
      {
        path: "/signup",
        element: <Signup />,
        action: signupAction,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
