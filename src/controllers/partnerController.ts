import { Request, Response } from 'express';
import { PartnerModel } from '../models/Partner';
import { partnerValidation } from '../utils/validation';

export class PartnerController {
  static async createPartner(req: Request, res: Response): Promise<void> {
    try {
      // Validate and set default values
      const { error, value } = partnerValidation.create.validate(req.body, { 
        abortEarly: true,  // Show all validation errors
        allowUnknown: true  // Allow additional properties
      });
  
      if (error) {
        res.status(400).json({ 
          error: 'Validation Failed', 
          details: error.details.map(err => err.message) 
        });
        return;
      }
  
      const existingPartner = await PartnerModel.findOne({ email: value.email });
      if (existingPartner) {
        res.status(400).json({ error: 'Partner already exists' });
        return;
      }
  
      const partner = new PartnerModel({
        ...value,
        status: value.status || 'active',
        currentLoad: value.currentLoad || 0,
        metrics: value.metrics || {
          rating: 5.0,
          completedOrders: 0,
          cancelledOrders: 0
        }
      });
  
      await partner.save();
      res.status(201).json(partner);
    } catch (error:any) {
      console.error('Partner creation error:', error);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  }

  static async getPartners(req: Request, res: Response): Promise<void> {
    try {
      const partners = await PartnerModel.find().select('-password');
      res.json(partners);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async updatePartner(req: Request, res: Response): Promise<void> {
    try {
      const partner = await PartnerModel.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      ).select('-password');

      if (!partner) {
        res.status(404).json({ error: 'Partner not found' });
        return;
      }

      res.json(partner);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async deletePartner(req: Request, res: Response): Promise<void> {
    try {
      const partner = await PartnerModel.findByIdAndDelete(req.params.id);
      if (!partner) {
        res.status(404).json({ error: 'Partner not found' });
        return;
      }
      res.json({ message: 'Partner deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getPartnerMetrics(req: Request, res: Response): Promise<void> {
    try {
      const partners = await PartnerModel.find();
      const metrics = {
        totalActive: partners.filter(p => p.status === 'active').length,
        avgRating: partners.reduce((acc, p) => acc + p.metrics.rating, 0) / partners.length,
        topAreas: Array.from(
          new Set(partners.flatMap(p => p.areas))
        ).slice(0, 5)
      };
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
}