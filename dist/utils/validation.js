"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderValidation = exports.partnerValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.partnerValidation = {
    create: joi_1.default.object({
        name: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required(),
        phone: joi_1.default.string().required(),
        areas: joi_1.default.array().items(joi_1.default.string()).required(),
        shift: joi_1.default.object({
            start: joi_1.default.string().required(),
            end: joi_1.default.string().required()
        }).required(),
        status: joi_1.default.string().valid('active', 'inactive').optional(),
        currentLoad: joi_1.default.number().default(0),
        metrics: joi_1.default.object({
            rating: joi_1.default.number().default(5.0),
            completedOrders: joi_1.default.number().default(0),
            cancelledOrders: joi_1.default.number().default(0)
        }).default()
    })
};
exports.orderValidation = {
    create: joi_1.default.object({
        customer: joi_1.default.object({
            name: joi_1.default.string().required(),
            phone: joi_1.default.string().required(),
            address: joi_1.default.string().required(),
        }).required(),
        area: joi_1.default.string().required(),
        items: joi_1.default.array().items(joi_1.default.object({
            name: joi_1.default.string().required(),
            quantity: joi_1.default.number().min(1).required(),
            price: joi_1.default.number().min(0).required(),
        })).required(),
        scheduledFor: joi_1.default.string().isoDate().required(),
    }),
};
