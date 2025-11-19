import express from "express";
import {
  purchaseCourse,
  getAllPurchasedCourse,
  getCourseDetailsWithPurchaseStatus,
} from "../controllers/coursePurchase.controller.js";
import isAuthenticated from "../middlewares/auth.js";

const router = express.Router();

// Direct purchase route (replaces Stripe checkout)
router.route("/course").post(isAuthenticated, purchaseCourse);

// Get course details with purchase status
router
  .route("/courses/:courseId/details-with-status")
  .get(isAuthenticated, getCourseDetailsWithPurchaseStatus);

// Get all purchased courses
router.route("/").get(isAuthenticated, getAllPurchasedCourse);

export default router;