"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentService = void 0;
const Partner_1 = require("../models/Partner");
const Assignment_1 = require("../models/Assignment");
const config_1 = require("../config/config");
class AssignmentService {
    static createAssignment(arg0) {
        throw new Error('Method not implemented.');
    }
    static assignOrderToPartner(order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Explicitly type the query result and use type assertion
                const availablePartners = yield Partner_1.PartnerModel.find({
                    status: 'active',
                    areas: order.area,
                    currentLoad: { $lt: config_1.config.maxPartnerLoad }
                }).sort({
                    currentLoad: 1,
                    'metrics.rating': -1,
                    'metrics.completedOrders': -1
                });
                if (availablePartners.length === 0) {
                    const assignment = new Assignment_1.AssignmentModel({
                        orderId: order._id,
                        partnerId: null, // Use null explicitly
                        status: 'failed',
                        reason: 'No available partners in area'
                    });
                    yield assignment.save();
                    return {
                        success: false,
                        error: 'No available partners in area',
                        assignment
                    };
                }
                // Use type assertion to ensure _id is of correct type
                const selectedPartner = availablePartners[0];
                const partnerObjectId = selectedPartner._id;
                // Explicitly update the assignedTo with the correct type
                order.set('assignedTo', partnerObjectId);
                order.status = 'assigned';
                yield order.save();
                yield Partner_1.PartnerModel.findByIdAndUpdate(partnerObjectId, {
                    $inc: {
                        currentLoad: 1,
                        'metrics.completedOrders': 0
                    }
                });
                // Create successful assignment record
                const assignment = new Assignment_1.AssignmentModel({
                    orderId: order._id,
                    partnerId: partnerObjectId,
                    status: 'success',
                    timestamp: new Date()
                });
                yield assignment.save();
                return {
                    success: true,
                    partner: selectedPartner,
                    assignment,
                    order
                };
            }
            catch (error) {
                console.error('Assignment error:', error);
                throw new Error(`Failed to assign order: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
    }
    static getAssignmentMetrics() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const totalAssigned = yield Assignment_1.AssignmentModel.countDocuments();
                const successfulAssignments = yield Assignment_1.AssignmentModel.countDocuments({ status: 'success' });
                return {
                    totalAssigned,
                    successRate: totalAssigned > 0
                        ? (successfulAssignments / totalAssigned) * 100
                        : 0,
                    failureReasons: yield this.getFailureReasons()
                };
            }
            catch (error) {
                console.error('Metrics error:', error);
                throw new Error('Failed to retrieve assignment metrics');
            }
        });
    }
    static getFailureReasons() {
        return __awaiter(this, void 0, void 0, function* () {
            const failedAssignments = yield Assignment_1.AssignmentModel.aggregate([
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
        });
    }
}
exports.AssignmentService = AssignmentService;
