# Murena's Students Library

This project is a web application for managing a student library system. It consists of a client-side React application and a server-side Node.js application.

## Client-Side

The client-side application is built using React and includes the following features:

- **Home Page**: The landing page of the application.
- **Admin Dashboard**: A protected route for administrators to manage library functionalities.
- **Not Found Page**: A fallback page for unmatched routes.

### File Structure

```
client
├── src
│   ├── index.jsx          # Entry point of the React application
│   ├── App.jsx            # Main application component with routing
│   ├── App.css            # CSS styles for the application
│   ├── components
│   │   └── Header.jsx     # Header component for navigation
│   ├── pages
│   │   ├── Home.jsx       # Home component
│   │   ├── AdminDashboard.jsx # Admin dashboard component
│   │   └── NotFound.jsx   # Not found component
│   ├── routes
│   │   ├── AppRoutes.jsx  # Main application routes
│   │   └── AdminRoute.jsx # Protected route for admin
│   └── services
│       └── api.js        # API service for server communication
└── package.json           # Client-side dependencies and scripts
```

## Server-Side

The server-side application is built using Node.js and Express. It provides the backend functionalities for the library system.

### File Structure

```
server
├── src
│   ├── index.js           # Entry point of the server application
│   ├── routes
│   │   └── admin.js       # Admin-related routes
│   └── controllers
│       └── adminController.js # Logic for admin routes
└── package.json           # Server-side dependencies and scripts
```

## Getting Started

To get started with the project, clone the repository and install the dependencies for both the client and server applications.

### Client

1. Navigate to the `client` directory.
2. Run `npm install` to install the client dependencies.
3. Run `npm start` to start the client application.

### Server

1. Navigate to the `server` directory.
2. Run `npm install` to install the server dependencies.
3. Run `npm start` to start the server application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.