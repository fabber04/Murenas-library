// client/src/routes/AppRoutes.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../pages/Home';
import AdminDashboard from '../pages/AdminDashboard';
import NotFound from '../pages/NotFound';
import AdminRoute from './AdminRoute';

const AppRoutes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <AdminRoute path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default AppRoutes;