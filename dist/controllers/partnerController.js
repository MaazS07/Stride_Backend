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
exports.PartnerController = void 0;
const Partner_1 = require("../models/Partner");
const validation_1 = require("../utils/validation");
class PartnerController {
    static createPartner(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate and set default values
                const { error, value } = validation_1.partnerValidation.create.validate(req.body, {
                    abortEarly: true, // Show all validation errors
                    allowUnknown: true // Allow additional properties
                });
                if (error) {
                    res.status(400).json({
                        error: 'Validation Failed',
                        details: error.details.map(err => err.message)
                    });
                    return;
                }
                const existingPartner = yield Partner_1.PartnerModel.findOne({ email: value.email });
                if (existingPartner) {
                    res.status(400).json({ error: 'Partner already exists' });
                    return;
                }
                const partner = new Partner_1.PartnerModel(Object.assign(Object.assign({}, value), { status: value.status || 'active', currentLoad: value.currentLoad || 0, metrics: value.metrics || {
                        rating: 5.0,
                        completedOrders: 0,
                        cancelledOrders: 0
                    } }));
                yield partner.save();
                res.status(201).json(partner);
            }
            catch (error) {
                console.error('Partner creation error:', error);
                res.status(500).json({ error: 'Server error', details: error.message });
            }
        });
    }
    static getPartners(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const partners = yield Partner_1.PartnerModel.find().select('-password');
                res.json(partners);
            }
            catch (error) {
                res.status(500).json({ error: 'Server error' });
            }
        });
    }
    static updatePartner(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const partner = yield Partner_1.PartnerModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).select('-password');
                if (!partner) {
                    res.status(404).json({ error: 'Partner not found' });
                    return;
                }
                res.json(partner);
            }
            catch (error) {
                res.status(500).json({ error: 'Server error' });
            }
        });
    }
    static deletePartner(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const partner = yield Partner_1.PartnerModel.findByIdAndDelete(req.params.id);
                if (!partner) {
                    res.status(404).json({ error: 'Partner not found' });
                    return;
                }
                res.json({ message: 'Partner deleted successfully' });
            }
            catch (error) {
                res.status(500).json({ error: 'Server error' });
            }
        });
    }
    static getPartnerMetrics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const partners = yield Partner_1.PartnerModel.find();
                const metrics = {
                    totalActive: partners.filter(p => p.status === 'active').length,
                    avgRating: partners.reduce((acc, p) => acc + p.metrics.rating, 0) / partners.length,
                    topAreas: Array.from(new Set(partners.flatMap(p => p.areas))).slice(0, 5)
                };
                res.json(metrics);
            }
            catch (error) {
                res.status(500).json({ error: 'Server error' });
            }
        });
    }
}
exports.PartnerController = PartnerController;
