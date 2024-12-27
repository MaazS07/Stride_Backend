"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', auth_1.auth, orderController_1.OrderController.getOrders);
router.post('/', auth_1.auth, orderController_1.OrderController.createOrder);
router.get('/:id', auth_1.auth, orderController_1.OrderController.getOrderById);
router.put('/:id/status', auth_1.auth, orderController_1.OrderController.updateOrderStatus);
router.post('/:id/assign', auth_1.auth, orderController_1.OrderController.assignOrder);
exports.default = router;
