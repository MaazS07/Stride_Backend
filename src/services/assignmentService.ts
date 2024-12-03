import mongoose, { Types } from 'mongoose';
import { OrderModel } from '../models/Order';
import { PartnerModel } from '../models/Partner';
import { AssignmentModel } from '../models/Assignment';
import { config } from '../config/config';
import { IOrderDocument } from '../models/Order';
import { IDeliveryPartner } from '../utils/types'; // Import the partner interface

export class AssignmentService {
  static async assignOrderToPartner(order: IOrderDocument) {
    try {
      // Explicitly type the query result and use type assertion
      const availablePartners = await PartnerModel.find({
        status: 'active',
        areas: order.area,
        currentLoad: { $lt: config.maxPartnerLoad }
      }).sort({
        currentLoad: 1,
        'metrics.rating': -1,
        'metrics.completedOrders': -1
      }) as unknown as (mongoose.Document & IDeliveryPartner)[];

      if (availablePartners.length === 0) {
        const assignment = new AssignmentModel({
          orderId: order._id,
          partnerId: null, // Use null explicitly
          status: 'failed',
          reason: 'No available partners in area'
        });
        await assignment.save();
        return { 
          success: false, 
          error: 'No available partners in area',
          assignment 
        };
      }

      // Use type assertion to ensure _id is of correct type
      const selectedPartner = availablePartners[0];
      const partnerObjectId = selectedPartner._id as Types.ObjectId;
      
      // Explicitly update the assignedTo with the correct type
      order.set('assignedTo', partnerObjectId);
      order.status = 'assigned';
      await order.save();

      await PartnerModel.findByIdAndUpdate(partnerObjectId, {
        $inc: { 
          currentLoad: 1,
          'metrics.completedOrders': 0 
        }
      });

      // Create successful assignment record
      const assignment = new AssignmentModel({
        orderId: order._id,
        partnerId: partnerObjectId,
        status: 'success',
        timestamp: new Date()
      });
      await assignment.save();

      return {
        success: true,
        partner: selectedPartner,
        assignment,
        order
      };
    } catch (error) {
      console.error('Assignment error:', error);
      throw new Error(`Failed to assign order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getAssignmentMetrics() {
    try {
      const totalAssigned = await AssignmentModel.countDocuments();
      const successfulAssignments = await AssignmentModel.countDocuments({ status: 'success' });
      
      return {
        totalAssigned,
        successRate: totalAssigned > 0 
          ? (successfulAssignments / totalAssigned) * 100 
          : 0,
        failureReasons: await this.getFailureReasons()
      };
    } catch (error) {
      console.error('Metrics error:', error);
      throw new Error('Failed to retrieve assignment metrics');
    }
  }

  private static async getFailureReasons() {
    const failedAssignments = await AssignmentModel.aggregate([
      { $match: { status: 'failed' } },
      { 
        $group: { 
          _id: '$reason', 
          count: { $sum: 1 } 
        } 
      }
    ]);

    return failedAssignments.map(item => ({
      reason: item._id || 'Unknown',
      count: item.count
    }));
  }
}