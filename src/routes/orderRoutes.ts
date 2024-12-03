import express from 'express';
import { OrderController } from '../controllers/orderController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, OrderController.getOrders);
router.post('/', auth, OrderController.createOrder);
router.get('/:id', auth, OrderController.getOrderById);
router.put('/:id/status', auth, OrderController.updateOrderStatus);
router.post('/:id/assign', auth, OrderController.assignOrder);

export default router;