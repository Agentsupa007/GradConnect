import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const router = express.Router();

// Logged-in users only
router.get(
  "/protected",
  authMiddleware,
  (req, res) => {
    res.json({
      success: true,
      message: "You are authenticated",
      user: req.user,
    });
  }
);

// Student-only
router.get(
  "/student",
  authMiddleware,
  authorizeRoles("student"),
  (req, res) => {
    res.json({
      success: true,
      message: "Student access granted",
    });
  }
);

// Recruiter-only
router.get(
  "/recruiter",
  authMiddleware,
  authorizeRoles("recruiter"),
  (req, res) => {
    res.json({
      success: true,
      message: "Recruiter access granted",
    });
  }
);

// Official-only
router.get(
  "/official",
  authMiddleware,
  authorizeRoles("official"),
  (req, res) => {
    res.json({
      success: true,
      message: "Placement official access granted",
    });
  }
);

export default router;
