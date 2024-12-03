import mongoose, { Schema, Document } from 'mongoose';
import { IOrderBase } from '../utils/types';



export interface IOrderDocument extends Document, IOrderBase {

}

const orderSchema = new Schema({
    orderNumber: { type: String, required: true, unique: true },
    customer: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true }
    },
    area: { type: String, required: true },
    items: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    status: {
        type: String,
        enum: ['pending', 'assigned', 'picked', 'delivered'],
        default: 'pending'
    },
    scheduledFor: { type: String, required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'Partner' },
    totalAmount: { type: Number, required: true }
}, { timestamps: true });

export const OrderModel = mongoose.model<IOrderDocument>('Order', orderSchema);