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
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
class AuthController {
    static loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield authService_1.AuthService.loginUser(email, password);
                res.json(result);
            }
            catch (error) {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        });
    }
    static loginPartner(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield authService_1.AuthService.loginPartner(email, password);
                res.json(result);
            }
            catch (error) {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        });
    }
    static registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, role } = req.body;
                if (!email || !password) {
                    res.status(400).json({ error: "Email and password are required" });
                    return;
                }
                if (!['admin', 'manager'].includes(role)) {
                    res.status(400).json({ error: 'Invalid role' });
                    return;
                }
                const result = yield authService_1.AuthService.registerUser(email, password, role);
                res.status(201).json(result);
            }
            catch (error) {
                // Send the actual error message
                res.status(400).json({ error: error.message || "Registration failed" });
            }
        });
    }
}
exports.AuthController = AuthController;
