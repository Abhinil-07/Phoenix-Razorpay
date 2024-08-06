import { Router } from "express";
import {
  checkout,
  paymentVeritication,
} from "../controllers/payment.controller";

const router = Router();

router.route("/checkout").post(checkout);
router.route("/verification").post(paymentVeritication);
export default router;
