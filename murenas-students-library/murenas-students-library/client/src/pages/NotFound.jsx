// This file exports the NotFound component, which is displayed when a route does not match any existing pages.

import React from 'react';

const NotFound = () => {
  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;