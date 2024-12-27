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
exports.AssignmentController = void 0;
const assignmentService_1 = require("../services/assignmentService");
const Assignment_1 = require("../models/Assignment");
const Order_1 = require("../models/Order");
const Partner_1 = require("../models/Partner");
class AssignmentController {
    static getMetrics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const metrics = yield assignmentService_1.AssignmentService.getAssignmentMetrics();
                res.json(metrics);
            }
            catch (error) {
                res.status(500).json({ error: 'Server error' });
            }
        });
    }
    static getAssignments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const assignments = yield Assignment_1.AssignmentModel.find()
                    .populate('orderId')
                    .populate('partnerId', 'name email');
                res.json(assignments);
            }
            catch (error) {
                res.status(500).json({ error: 'Server error' });
            }
        });
    }
    static runAssignment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId, partnerId } = req.body;
                if (!orderId || !partnerId) {
                    res.status(400).json({ error: 'orderId and partnerId are required' });
                    return;
                }
                const order = yield Order_1.OrderModel.findById(orderId);
                if (!order) {
                    res.status(404).json({ error: 'Order not found' });
                    return;
                }
                const result = yield assignmentService_1.AssignmentService.assignOrderToPartner(orderId);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Server error' });
            }
        });
    }
    static getPartnerOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const partnerId = req.params.partnerId;
                console.log('Fetching orders for partner:', partnerId);
                const partner = yield Partner_1.PartnerModel.findById(partnerId);
                if (!partner) {
                    res.status(404).json({ error: 'Partner not found' });
                    return;
                }
                const assignments = yield Assignment_1.AssignmentModel.find({
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
            }
            catch (error) {
                console.error('Error fetching partner orders:', error);
                res.status(500).json({ error: 'Failed to fetch partner orders' });
            }
        });
    }
    static updateOrderStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = req.params;
                const { status, partnerId } = req.body;
                const partner = yield Partner_1.PartnerModel.findById(partnerId);
                if (!partner) {
                    res.status(404).json({ error: 'Partner not found' });
                    return;
                }
                const assignment = yield Assignment_1.AssignmentModel.findOne({
                    orderId,
                    partnerId,
                    status: 'success'
                });
                if (!assignment) {
                    res.status(403).json({ error: 'Order not assigned to this partner' });
                    return;
                }
                const order = yield Order_1.OrderModel.findByIdAndUpdate(orderId, { status }, { new: true });
                if (!order) {
                    res.status(404).json({ error: 'Order not found' });
                    return;
                }
                res.json(order);
            }
            catch (error) {
                console.error('Error updating order status:', error);
                res.status(500).json({ error: 'Failed to update order status' });
            }
        });
    }
}
exports.AssignmentController = AssignmentController;
