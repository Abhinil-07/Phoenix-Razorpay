require("dotenv").config();
import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import paymentRouter from "./routes/payment.routes";

const app: Application = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors());
app.use("/api/payment", paymentRouter);
app.get("/", (req, res) => {
  res.status(200).send("Health check endpoint for server");
});

app.get("/api/v1/getKey", (req, res) => {
  res.status(200).json({
    key_id: process.env.RAZORPAY_KEY_ID,
  });
});

export { app };
