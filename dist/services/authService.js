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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const Partner_1 = require("../models/Partner");
const config_1 = require("../config/config");
class AuthService {
    static loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.UserModel.findOne({ email });
            if (!user || !(yield user.comparePassword(password))) {
                throw new Error('Invalid credentials');
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.config.jwtSecret, {
                expiresIn: config_1.config.jwtExpiresIn,
            });
            return { user, token };
        });
    }
    static loginPartner(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const partner = yield Partner_1.PartnerModel.findOne({ email });
            if (!partner || !(yield partner.comparePassword(password))) {
                throw new Error('Invalid credentials');
            }
            const token = jsonwebtoken_1.default.sign({ partnerId: partner._id }, config_1.config.jwtSecret, {
                expiresIn: config_1.config.jwtExpiresIn,
            });
            return { partner, token };
        });
    }
    static registerUser(email, password, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield User_1.UserModel.findOne({ email });
            if (existingUser) {
                throw new Error('Email already exists');
            }
            const user = new User_1.UserModel({ email, password, role });
            yield user.save();
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.config.jwtSecret, {
                expiresIn: config_1.config.jwtExpiresIn,
            });
            return { user, token };
        });
    }
}
exports.AuthService = AuthService;
