import express from 'express';
import { AssignmentController } from '../controllers/assignmentController';
import { auth } from '../middleware/auth';

// import { auth, checkRole } from '../middleware/auth';

const router = express.Router();

router.get('/metrics', auth, AssignmentController.getMetrics);
router.get('/', auth, AssignmentController.getAssignments);
router.post('/run', auth, AssignmentController.runAssignment);
router.get('/partner/:partnerId/orders',  AssignmentController.getPartnerOrders);
router.put('/order/:orderId/status',  AssignmentController.updateOrderStatus);





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

export default router;
