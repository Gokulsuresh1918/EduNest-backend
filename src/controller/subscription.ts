import { Request, Response } from "express";
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

export const updateSubscribe=(req: any,res: any)=>{
console.log('backill',req.params.id);
console.log('bodyill vanau',req.body.data);

}