import { instance } from "../server";
import { Request, Response } from "express";

import { Payment } from "../models/payment.model";
import { Member } from "../models/members.model";
import Redis from "ioredis";
import crypto from "crypto";
const redis = new Redis({
  host: "redis-10712.c305.ap-south-1-1.ec2.redns.redis-cloud.com",
  port: 10712,
  password: "SqQpUjOR47uKQONYGRWMqZjLlTTEOJvK",
});

redis.on("connect", () => {
  console.log("Redis connected");
});

export const checkout = async (req: Request, res: Response) => {
  const { amount } = req.body;
  const options = {
    amount: Number(amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);
  const member = await Member.findOneAndUpdate(
    { studentID: req.body.studentID },
    {
      razorpay_order_id: order.id,
      status: order.status,
    },

    { new: true }
  );
  console.log(member);
  console.log("I'm here");
  res.status(200).json({
    success: true,
    order,
    member,
  });
};

export const razorpayWebhook = async (req: Request, res: Response) => {
  const secret = "Wa8T3Kb@E@nhBCN"; // Replace with your Razorpay webhook secret
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    studentID,
  } = req.body;
  try {
    // Verify webhook signature
    const webhookSignature = req.headers["x-razorpay-signature"];
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (webhookSignature !== expectedSignature) {
      console.log("Invalid signature");
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // Handle the event
    const event = req.body.event;
    const payload = req.body.payload;

    if (event === "payment.captured") {
      const paymentDetails = payload.payment.entity;
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        studentID,
      });

      //TODO: Add the studentID to the student database
      const updatedMember = await Member.findOneAndUpdate(
        { studentID }, // Filter to find the member
        { razorpay_order_id }, // Update to apply
        { new: true } // Option to return the updated document
      );
      console.log(updatedMember);
      // Print payment details
      console.log("Payment Captured:");
      console.log(`Order ID: ${paymentDetails.order_id}`);
      console.log(`Payment ID: ${paymentDetails.id}`);
      console.log(`Amount: ${paymentDetails.amount}`);
      console.log(`Status: ${paymentDetails.status}`);
    } else {
      console.log(`Unhandled event: ${event}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// export const paymentVerification = async (req: Request, res: Response) => {
// const {
//   razorpay_order_id,
//   razorpay_payment_id,
//   razorpay_signature,
//   studentID,
// } = req.body;

//   const body = razorpay_order_id + "|" + razorpay_payment_id;

//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
//     .update(body.toString())
//     .digest("hex");

//   const isAuthentic = expectedSignature === razorpay_signature;
//   console.log(isAuthentic);
//   if (isAuthentic) {
//     // Database comes here

// await Payment.create({
//   razorpay_order_id,
//   razorpay_payment_id,
//   razorpay_signature,
//   studentID,
// });

// //TODO: Add the studentID to the student database
// const updatedMember = await Member.findOneAndUpdate(
//   { studentID }, // Filter to find the member
//   { razorpay_order_id }, // Update to apply
//   { new: true } // Option to return the updated document
// );
// console.log(updatedMember);
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.MAIL_SENDER,
//     pass: process.env.MAIL_PASSWORD,
//   },
// });

// const mailOptions = {
//   from: process.env.MAIL_SENDER,
//   to: "ichandrimapaul@gmail.com",
//   subject: "Congratulations on becoming a member of Phoenix NSEC",
//   html: welcomeMailTemplate({ participantName: updatedMember?.name }),
// };
// transporter.sendMail(mailOptions, function (error: any, info: any) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Email sent: " + info.response);
//   }
// });

//     return res.status(200).json({
//       success: true,
//       razorpay_order_id,
//       updatedMember,
//     });
//   } else {
//     res.status(400).json({
//       success: false,
//     });
//   }
// };

// export const paymentVeritication = async (req: Request, res: Response) => {
//   const secret = "123456";

//   console.log(req.body);

//   const crypto = require("crypto");

//   const shasum = crypto.createHmac("sha256", secret);
//   shasum.update(JSON.stringify(req.body));
//   const digest = shasum.digest("hex");

//   console.log(digest, req.headers["x-razorpay-signature"]);

//   if (digest === req.headers["x-razorpay-signature"]) {
//     console.log("request is legit");
//     // process it
//     console.log(JSON.stringify(req.body));
//     const order_id = req.body.payload.payment.entity.order_id;
//     const payment_id = req.body.payload.payment.entity.id;
//     const status = req.body.payload.payment.entity.status;
//     const member = await Member.findOneAndUpdate(
//       { razorpay_order_id: order_id },
//       { status: status }
//     );
//     await Payment.create({
//       razorpay_order_id: order_id,
//       razorpay_payment_id: payment_id,
//       status: status,
//       studentID: member?.studentID,
//     });
//     console.log(member);
//     if (member) {
//       console.log("inside redis if else");
//       const info = await redis.lpush(
//         "emailQueue",
//         JSON.stringify({
//           to: member.email, // Replace with the correct email field
//           participantName: member.name, // Replace with the correct name field
//         })
//       );
//       console.log(info)
//       console.log("Job added to queue");
//     } else {
//       console.log("Member not found");
//     }
//   } else {
//     // pass it
//   }

//   return res.status(200).json({
//     status: "ok",
//   });
// };
