import express from 'express';
import { PartnerController } from '../controllers/partnerController';
import { auth, checkRole } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, PartnerController.getPartners);
router.post('/', auth, checkRole(['admin']), PartnerController.createPartner);
router.put('/:id', auth, checkRole(['admin']), PartnerController.updatePartner);
router.delete('/:id', auth, checkRole(['admin']), PartnerController.deletePartner);
router.get('/metrics', auth, PartnerController.getPartnerMetrics);

export default router;