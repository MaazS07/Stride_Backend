import mongoose, { Schema, Document, Model } from 'mongoose';
import { IAssignmentBase } from '../utils/types';

export interface IAssignmentDocument extends Document, IAssignmentBase {}

const assignmentSchema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    partnerId: { type: Schema.Types.ObjectId, ref: 'Partner', required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['success', 'failed'], required: true },
    reason: { type: String }
});

export const AssignmentModel = mongoose.model<IAssignmentDocument>('Assignment', assignmentSchema);
