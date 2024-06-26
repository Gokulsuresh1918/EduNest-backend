import { Request, Response } from "express";
import { User } from "../modal/users";
import Razorpay from "razorpay";

const razorpayInstance = new Razorpay({
  key_id: process.env.KEY_ID as string, 
  key_secret: process.env.KEY_SECRET as string,
});

export const createOrder = async (req: Request, res: Response) => {
  
  const { amount } = req.body; 

  try {
    const order = await razorpayInstance.orders.create({
      amount: amount * 100, 
      currency: "INR",
      receipt: "order_rcptid_11",
    });

    res.status(200).json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};


export const updateSubscribe = async (req:Request, res:Response) => {
  const userId = req.params.id;
  const paymentDetails = req.body.data;

  console.log('backill', userId);
  console.log('bodyill vanau', paymentDetails);

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isSubscribed = true; 
    user.paymentDetails = paymentDetails; 

    await user.save();

    return res.status(200).json({ message: "User subscription updated successfully", user });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
