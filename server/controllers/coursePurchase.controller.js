import Stripe from "stripe";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import {User} from "../models/user.model.js";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const purchaseCourse = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found." });

    // Check if already purchased
    const existingPurchase = await CoursePurchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res.status(400).json({ message: "Course already purchased." });
    }

    // Create a new course purchase record with completed status
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "completed",
      paymentIntentId: `direct_${Date.now()}`, // Generate a unique ID
    });

    await newPurchase.save();

    // Update user's enrolledCourses
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: courseId } },
      { new: true }
    );

    // Update course enrolledStudents
    await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { enrolledStudents: userId } },
      { new: true }
    );

    // Optionally unlock all lectures
    if (course.lectures.length > 0) {
      await Lecture.updateMany(
        { _id: { $in: course.lectures } },
        { $set: { isPreviewFree: true } }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Course purchased successfully",
      courseId: courseId,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const stripeWebhook = async (req, res) => {
  let event;
 
  try {
    const sig = req.headers['stripe-signature'];
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

    // ✅ Use the actual signature from Stripe headers
    event = stripe.webhooks.constructEvent(req.body, sig, secret);
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;

      const purchase = await CoursePurchase.findOne({
        paymentIntentId: session.id,
      }).populate({ path: "courseId" });

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }
      purchase.status = "completed";

      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      await purchase.save();

      // Update user's enrolledCourses
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } },
        { new: true }
      );

      // Update course enrolledStudents
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } },
        { new: true }
      );

      console.log(`✅ User ${purchase.userId} enrolled in course ${purchase.courseId._id}`);
    
    } catch (error) {
      console.error("Error handling event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  res.status(200).send();
};



export const getCourseDetailsWithPurchaseStatus = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.id; // Assuming you're getting the user ID from authentication middleware

  try {
    // Fetch the course details
    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    // Check if the user has purchased the course
    const purchased = await CoursePurchase.findOne({ userId, courseId });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({
      course,
      purchased: !!purchased, // true if purchased, false otherwise
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching course details" });
  }
};
export const getAllPurchasedCourse = async (req, res) => {
  try {
    // const adminId = req.id;
    const purchasedCourse = await CoursePurchase.find({status: "completed"}).populate("courseId");
    
    if(!purchasedCourse){
      return res.status(404).json({
        purchasedCourse:[]
      })
    }
    return res.status(200).json({
      purchasedCourse
    })
  } catch (error) {
    console.log(error);
  }
};

