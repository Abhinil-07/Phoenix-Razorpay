import express, { Application } from "express";
import dotenv from "dotenv";
import connectDB from "./db/db";
import Razorpay from "razorpay";
import { app } from "./app";

dotenv.config();

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log("Server is running on port " + process.env.PORT);
    });
  })
  .catch(() => {
    console.log("MongoDB connection failed from Server.ts");
  });

export default app;
