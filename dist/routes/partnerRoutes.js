"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const partnerController_1 = require("../controllers/partnerController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', auth_1.auth, partnerController_1.PartnerController.getPartners);
router.post('/', auth_1.auth, (0, auth_1.checkRole)(['admin']), partnerController_1.PartnerController.createPartner);
router.put('/:id', auth_1.auth, (0, auth_1.checkRole)(['admin']), partnerController_1.PartnerController.updatePartner);
router.delete('/:id', auth_1.auth, (0, auth_1.checkRole)(['admin']), partnerController_1.PartnerController.deletePartner);
router.get('/metrics', auth_1.auth, partnerController_1.PartnerController.getPartnerMetrics);
exports.default = router;
