import { Request, Response } from 'express';
import { AssignmentService } from '../services/assignmentService';
import { AssignmentModel } from '../models/Assignment';
import { OrderModel } from '../models/Order';
import { IOrderDocument } from '../models/Order';
import { PartnerModel } from '../models/Partner';

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
      const { orderId, partnerId } = req.body;
  
      if (!orderId || !partnerId) {
        res.status(400).json({ error: 'orderId and partnerId are required' });
        return;
      }
  
      const order = await OrderModel.findById(orderId) as IOrderDocument | null;
  
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
  
      const result = await AssignmentService.assignOrderToPartner(orderId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
  static async getPartnerOrders(req: Request, res: Response): Promise<void> {
    try {
      const partnerId = req.params.partnerId;
      console.log('Fetching orders for partner:', partnerId);
      
      const partner = await PartnerModel.findById(partnerId);
      if (!partner) {
        res.status(404).json({ error: 'Partner not found' });
        return;
      }

      const assignments = await AssignmentModel.find({
        partnerId,
        status: 'success'
      }).populate({
        path: 'orderId',
        model: 'Order'
      });

      const orders = assignments
        .map(assignment => assignment.orderId)
        .filter(order => order != null);

      console.log(`Found ${orders.length} orders for partner ${partnerId}`);
      res.json(orders);
    } catch (error) {
      console.error('Error fetching partner orders:', error);
      res.status(500).json({ error: 'Failed to fetch partner orders' });
    }
  }

  static async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const { status, partnerId } = req.body;

      const partner = await PartnerModel.findById(partnerId);
      if (!partner) {
        res.status(404).json({ error: 'Partner not found' });
        return;
      }

      const assignment = await AssignmentModel.findOne({
        orderId,
        partnerId,
        status: 'success'
      });

      if (!assignment) {
        res.status(403).json({ error: 'Order not assigned to this partner' });
        return;
      }

      const order = await OrderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      res.json(order);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  }
}
