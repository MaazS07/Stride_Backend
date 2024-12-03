import { Request, Response } from 'express';
import { AssignmentService } from '../services/assignmentService';
import { AssignmentModel } from '../models/Assignment';
import { OrderModel } from '../models/Order';
import { IOrderDocument } from '../models/Order';

export class AssignmentController {
  static async getMetrics(req: Request, res: Response): Promise<void> {
    try {
      const metrics = await AssignmentService.getAssignmentMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getAssignments(req: Request, res: Response): Promise<void> {
    try {
      const assignments = await AssignmentModel.find()
        .populate('orderId')
        .populate('partnerId', 'name email');
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async runAssignment(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.body;
      const order = await OrderModel.findById(orderId);
      
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