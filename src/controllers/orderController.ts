import { Request, Response } from 'express';
import { OrderModel } from '../models/Order';
import { PartnerModel } from '../models/Partner';
import { orderValidation } from '../utils/validation';
import { AssignmentService } from '../services/assignmentService';

export class OrderController {
  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { error } = orderValidation.create.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const orderNumber = `ORD${Date.now()}`;
      const totalAmount = req.body.items.reduce(
        (sum: number, item: any) => sum + (item.price * item.quantity),
        0
      );

      const order = new OrderModel({
        ...req.body,
        orderNumber,
        totalAmount,
      });

      await order.save();
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const { status, area, date } = req.query;
      let query: any = {};

      if (status) query.status = status;
      if (area) query.area = area;
      if (date) {
        const startDate = new Date(date as string);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        query.createdAt = { $gte: startDate, $lt: endDate };
      }

      const orders = await OrderModel.find(query).populate('assignedTo', 'name email');
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.body;
      const order = await OrderModel.findByIdAndUpdate(
        req.params.id,
        { $set: { status } },
        { new: true }
      );

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      if (status === 'delivered') {
        await PartnerModel.findByIdAndUpdate(order.assignedTo, {
          $inc: {
            'metrics.completedOrders': 1,
            currentLoad: -1
          }
        });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
  static async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const order = await OrderModel.findById(req.params.id)
        .populate('assignedTo', 'name email');

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async assignOrder(req: Request, res: Response): Promise<void> {
    try {
      const order = await OrderModel.findById(req.params.id);
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      const result = await AssignmentService.assignOrderToPartner(order);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
}