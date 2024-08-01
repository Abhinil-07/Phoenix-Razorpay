import { instance } from "../server";
import { Request, Response } from "express";
import crypto from "crypto";
import { Payment } from "../models/payment.model";
export const checkout = async (req: Request, res: Response) => {
  const { amount } = req.body;
  const options = {
    amount: Number(amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    order,
  });
};

export const paymentVerification = async (req: Request, res: Response) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    studentID,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;
  console.log(isAuthentic);
  if (isAuthentic) {
    // Database comes here

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      studentID,
    });

    //TODO: Add the studentID to the student database

    return res.status(200).json({
      success: true,
      razorpay_order_id,
    });
    // res.redirect(`http://localhost:3000`);
  } else {
    res.status(400).json({
      success: false,
    });
  }
};
