import { instance } from "../server";
import { Request, Response } from "express";
import crypto from "crypto";
import { Payment } from "../models/payment.model";
import { Member } from "../models/members.model";
import welcomeMailTemplate from "../template/mailTemplate";
const nodemailer = require("nodemailer");

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

// export const paymentVerification = async (req: Request, res: Response) => {
//   const {
//     razorpay_order_id,
//     razorpay_payment_id,
//     razorpay_signature,
//     studentID,
//   } = req.body;

//   const body = razorpay_order_id + "|" + razorpay_payment_id;

//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
//     .update(body.toString())
//     .digest("hex");

//   const isAuthentic = expectedSignature === razorpay_signature;
//   console.log(isAuthentic);
//   if (isAuthentic) {
//     // Database comes here

//     await Payment.create({
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       studentID,
//     });

//     //TODO: Add the studentID to the student database
//     const updatedMember = await Member.findOneAndUpdate(
//       { studentID }, // Filter to find the member
//       { razorpay_order_id }, // Update to apply
//       { new: true } // Option to return the updated document
//     );
//     console.log(updatedMember);
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.MAIL_SENDER,
//         pass: process.env.MAIL_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: process.env.MAIL_SENDER,
//       to: "ichandrimapaul@gmail.com",
//       subject: "Congratulations on becoming a member of Phoenix NSEC",
//       html: welcomeMailTemplate({ participantName: updatedMember?.name }),
//     };
//     transporter.sendMail(mailOptions, function (error: any, info: any) {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log("Email sent: " + info.response);
//       }
//     });

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

export const paymentVeritication = async (req: Request, res: Response) => {
  const secret = "123456";

  console.log(req.body);

  const crypto = require("crypto");

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
    // process it
    console.log(JSON.stringify(req.body));
    const order_id = req.body.payload.payment.entity.order_id;
    const payment_id = req.body.payload.payment.entity.id;
    const order = await Payment.create({
      razorpay_order_id: order_id,
      razorpay_payment_id: payment_id,
    });
  } else {
    // pass it
  }

  return res.status(200).json({
    status: "ok",
  });
};
