import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/coursePurchase.route.js";
import courseProgress from "./routes/courseprogress.route.js";
import path from "path"
import morgan from "morgan";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const DIRNAME = path.resolve();

// app.use(
//   "/api/v1/purchase/webhook",
//   express.raw({ type: "application/json" })
// );

// default middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://lms-five-swart-45.vercel.app",
      "https://lms-1-el7t.onrender.com"  
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

// api's
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/course-progress", courseProgress);

// serve static files from server
app.use(express.static(path.join(DIRNAME,"/client/dist")));
app.use("*",(_,res) => {
    res.sendFile(path.resolve(DIRNAME, "client","dist","index.html"));
})

app.listen(PORT, () => {
  connectDB();
  console.log(`Server listen at port ${PORT}`);
});
