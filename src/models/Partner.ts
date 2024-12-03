import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IDeliveryPartnerBase } from '../utils/types';

export interface IPartnerDocument extends Document, IDeliveryPartnerBase {
    comparePassword(password: string): Promise<boolean>;
}

const partnerSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    currentLoad: { type: Number, default: 0 },
    areas: [{ type: String }],
    shift: {
        start: { type: String, required: true },
        end: { type: String, required: true }
    },
    metrics: {
        rating: { type: Number, default: 5.0 },
        completedOrders: { type: Number, default: 0 },
        cancelledOrders: { type: Number, default: 0 }
    }
}, { timestamps: true });

partnerSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

partnerSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

export const PartnerModel = mongoose.model<IPartnerDocument>('Partner', partnerSchema);

