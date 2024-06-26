import express from 'express';
import { createOrder,updateSubscribe } from '../controller/subscription';

const router = express.Router();

router.post('/createOrder', createOrder);
router.post('/updateSubscribe/:id', updateSubscribe);

export default router;
  