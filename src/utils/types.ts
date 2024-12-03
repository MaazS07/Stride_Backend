// // types.ts
// import { Types } from 'mongoose';

// // Base interfaces without _id
// export interface IDeliveryPartnerBase {
//     name: string;
//     email: string;
//     password: string;
//     phone: string;
//     status: 'active' | 'inactive';
//     currentLoad: number;
//     areas: string[];
//     shift: {
//         start: string;
//         end: string;
//     };
//     metrics: {
//         rating: number;
//         completedOrders: number;
//         cancelledOrders: number;
//     };
// }

// export interface IOrderBase {
//     orderNumber: string;
//     customer: {
//         name: string;
//         phone: string;
//         address: string;
//     };
//     area: string;
//     items: {
//         name: string;
//         quantity: number;
//         price: number;
//     }[];
//     status: 'pending' | 'assigned' | 'picked' | 'delivered';
//     scheduledFor: string;
//     assignedTo?: Types.ObjectId;
//     totalAmount: number;
// }

// export interface IAssignmentBase {
//     orderId: Types.ObjectId;
//     partnerId: Types.ObjectId;
//     timestamp: Date;
//     status: 'success' | 'failed';
//     reason?: string;
// }

// export interface IUserBase {
//     email: string;
//     password: string;
//     role: 'admin' | 'manager';
// }

// Document interfaces
import { Types } from 'mongoose';

export interface IDeliveryPartnerBase {
    name: string;
    email: string;
    password: string;
    phone: string;
    status: 'active' | 'inactive';
    currentLoad: number;
    areas: string[];
    shift: {
        start: string;
        end: string;
    };
    metrics: {
        rating: number;
        completedOrders: number;
        cancelledOrders: number;
    };
}

export interface IOrderBase {
    orderNumber: string;
    customer: {
        name: string;
        phone: string;
        address: string;
    };
    area: string;
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
    status: 'pending' | 'assigned' | 'picked' | 'delivered';
    scheduledFor: Date;
    assignedTo?: Types.ObjectId;
    totalAmount: number;
}

export interface IAssignmentBase {
    orderId: Types.ObjectId;
    partnerId?: Types.ObjectId; // Make partnerId optional
    timestamp: Date;
    status: 'success' | 'failed';
    reason?: string;
}

export interface IUserBase {
    email: string;
    password: string;
    role: 'admin' | 'manager';
}

// Rest of the code remains the same
import { Document } from 'mongoose';

export interface IDeliveryPartner extends IDeliveryPartnerBase {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrder extends IOrderBase {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAssignment extends IAssignmentBase {
    _id: Types.ObjectId;
}

export interface IUser extends IUserBase {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}