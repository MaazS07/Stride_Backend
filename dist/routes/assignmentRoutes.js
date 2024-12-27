"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assignmentController_1 = require("../controllers/assignmentController");
const auth_1 = require("../middleware/auth");
// import { auth, checkRole } from '../middleware/auth';
const router = express_1.default.Router();
router.get('/metrics', auth_1.auth, assignmentController_1.AssignmentController.getMetrics);
router.get('/', auth_1.auth, assignmentController_1.AssignmentController.getAssignments);
router.post('/run', auth_1.auth, assignmentController_1.AssignmentController.runAssignment);
router.get('/partner/:partnerId/orders', assignmentController_1.AssignmentController.getPartnerOrders);
router.put('/order/:orderId/status', assignmentController_1.AssignmentController.updateOrderStatus);
// router.get(
//   '/partner/:partnerId/orders',
//   auth,
//   checkRole(['partner', 'admin']),
//   AssignmentController.getPartnerOrders
// );
// router.put(
//   '/order/:orderId/status',
//   auth,
//   checkRole(['partner', 'admin']),
//   AssignmentController.updateOrderStatus
// );
exports.default = router;
