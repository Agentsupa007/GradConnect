const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (req.user.userRole === "admin") return next();

    if (!req.user || !allowedRoles.includes(req.user.userRole)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource",
      });
    }
    next();
  };
};

export default authorizeRoles;
