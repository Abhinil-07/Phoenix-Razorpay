import { Router } from "express";
import {
  checkout,
  razorpayWebhook,
  // paymentVeritication,
} from "../controllers/payment.controller";

const router = Router();

router.route("/checkout").post(checkout);
router.route("/webhook").post(razorpayWebhook);
// router.route("/verification").post(paymentVeritication)
export default router;
