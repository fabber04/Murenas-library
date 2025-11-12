import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import AdminRoute from './routes/AdminRoute';

const App = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <AdminRoute path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default App;