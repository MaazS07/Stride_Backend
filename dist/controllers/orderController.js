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
exports.OrderController = void 0;
const Order_1 = require("../models/Order");
const Partner_1 = require("../models/Partner");
const validation_1 = require("../utils/validation");
const assignmentService_1 = require("../services/assignmentService");
class OrderController {
    static createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error } = validation_1.orderValidation.create.validate(req.body);
                if (error) {
                    res.status(400).json({ error: error.details[0].message });
                    return;
                }
                const orderNumber = `ORD${Date.now()}`;
                const totalAmount = req.body.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const order = new Order_1.OrderModel(Object.assign(Object.assign({}, req.body), { orderNumber,
                    totalAmount }));
                yield order.save();
                res.status(201).json(order);
            }
            catch (error) {
                res.status(500).json({ error: 'Server error' });
            }
        });
    }
    static getOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status, area, date } = req.query;
                let query = {};
                if (status)
                    query.status = status;
                if (area)
                    query.area = area;
                if (date) {
                    const startDate = new Date(date);
                    const endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + 1);
                    query.createdAt = { $gte: startDate, $lt: endDate };
                }
                const orders = yield Order_1.OrderModel.find(query).populate('assignedTo', 'name email');
                res.json(orders);
            }
            catch (error) {
                res.status(500).json({ error: 'Server error' });
            }
        });
    }
    static updateOrderStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status } = req.body;
                const order = yield Order_1.OrderModel.findByIdAndUpdate(req.params.id, { $set: { status } }, { new: true });
                if (!order) {
                    res.status(404).json({ error: 'Order not found' });
                    return;
                }
                if (status === 'delivered') {
                    yield Partner_1.PartnerModel.findByIdAndUpdate(order.assignedTo, {
                        $inc: {
                            'metrics.completedOrders': 1,
                            currentLoad: -1
                        }
                    });
                }
                res.json(order);
            }
            catch (error) {
                res.status(500).json({ error: 'Server error' });
            }
        });
    }
    static getOrderById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield Order_1.OrderModel.findById(req.params.id)
                    .populate('assignedTo', 'name email');
                if (!order) {
                    res.status(404).json({ error: 'Order not found' });
                    return;
                }
                res.json(order);
            }
            catch (error) {
                res.status(500).json({ error: 'Server error' });
            }
        });
    }
    static assignOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield Order_1.OrderModel.findById(req.params.id);
                if (!order) {
                    res.status(404).json({ error: 'Order not found' });
                    return;
                }
                const result = yield assignmentService_1.AssignmentService.assignOrderToPartner(order);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Server error' });
            }
        });
    }
}
exports.OrderController = OrderController;
