import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// Mock function to check if the user is an admin
const isAdmin = () => {
  // Replace this with your actual admin check logic
  return true; // For now, we assume the user is an admin
};

const AdminRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        isAdmin() ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default AdminRoute;