const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Razorpay = require("razorpay");
require("dotenv").config();
// const razorpayConfig = require("./config/config");
const app = express();
const crypto = require("crypto");

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.sendFile("./inde.html", { root: __dirname });
});

app.post("/create-order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const { amount } = req.body;

    const options = {
      amount: amount * 100, // Convert amount to paise
      currency: "INR",
      receipt: "mc#01",
      notes: { purpose: "Test payment", additionalInfo: "Optional note" },
    };

    order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to create order",
    });
  }
});

app.get("/verify-payment", async (req, res) => {
  try {
    const order = req.body.order;

    // create hmac object
    const secret = process.env.RAZORPAY_SECRET_KEY;
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(order.order_id + "|" + order.payment_id);

    const generateSignature = hmac.digest("hex");

    if (generateSignature == order.signature) {
      return res.status(200).send({
        success: true,
        message: "Payment Verified",
      });
    } else {
      return res
        .status(400)
        .send({ success: false, message: "Payment not verified" });
    }

    const options = {
      key_id: process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay Key ID
      amount: order.amount,
      currency: order.currency,
      name: "Test Transaction",
      description: "Pay ₹500",
      order_id: order.id,
      handler: function (response) {
        alert(
          `Payment successful! Payment ID: ${response.razorpay_payment_id}`
        );
      },
      prefill: {
        name: "ajay shinde",
        email: "ajayshinde@gmail.com",
        contact: "1234567890",
      },
      theme: {
        color: "#3399cc",
      },
    };
    console.log({ options });

    const rzp = new RazorPay(options);
    // rzp.open();
    res.send(rzp);
  } catch (error) {
    console.error("Payment failed:", error);
    // alert('Payment failed. Please try again.');
  }
});

// Listen
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}...`);
});
