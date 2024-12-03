import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { PartnerModel } from '../models/Partner';
import { config } from '../config/config';

export class AuthService {
  static async loginUser(email: string, password: string) {
    const user = await UserModel.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    return { user, token };
  }

  static async loginPartner(email: string, password: string) {
    const partner = await PartnerModel.findOne({ email });
    
    if (!partner || !(await partner.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ partnerId: partner._id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    return { partner, token };
  }

  static async registerUser(email: string, password: string, role: 'admin' | 'manager') {
    const existingUser = await UserModel.findOne({ email });
    
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const user = new UserModel({ email, password, role });
    await user.save();

    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    return { user, token };
  }
}