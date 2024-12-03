import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
  static async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await AuthService.loginUser(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  }

  static async loginPartner(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await AuthService.loginPartner(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  }

  static async registerUser(req: Request, res: Response): Promise<void> {
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
  
      const result = await AuthService.registerUser(email, password, role);
      res.status(201).json(result);
    } catch (error: any) {
      // Send the actual error message
      res.status(400).json({ error: error.message || "Registration failed" });
    }
  }
}