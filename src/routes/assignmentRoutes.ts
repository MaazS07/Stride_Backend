import express from 'express';
import { AssignmentController } from '../controllers/assignmentController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/metrics', auth, AssignmentController.getMetrics);
router.get('/', auth, AssignmentController.getAssignments);
router.post('/run', auth, AssignmentController.runAssignment);

export default router;