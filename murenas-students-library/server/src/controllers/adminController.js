// server/src/controllers/adminController.js
const getAdminDashboard = (req, res) => {
  res.status(200).json({ message: "Welcome to the admin dashboard!" });
};

module.exports = {
  getAdminDashboard,
};