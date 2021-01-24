import * as mongoose from 'mongoose'

export const UserSchema =  new mongoose.Schema({
    firstname: String,
    lastname: String,
    gender: {
        type: String,
        enum: ['MALE' , 'FEMELLE']
    },
    dateOfBirth: Date,
    address: String,
    email: {
        type: String,
    },
    phone: String,
    password: String,
    salt: String,
    customerType: {
        type: String,
        enum: ['CUSTOMER' , 'ADMINISTRATION']
    },
    role: {
        type: String,
        enum: ['admin' , 'patient', 'doctor']
    },
    profilePicture: String,
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: Date,
    updatedAt: Date,

    
})


export interface User extends mongoose.Document {
    firstname: string;
    lastname: string;
    gender: GenderEnum;
    dateOfBirth: Date;
    address: string;
    email: string;
    phone: string;
    password: string;
    customerType: CustomerTypeEnum;
    role: RoleEnum;
    profilePicture: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    salt: string;
}




export enum GenderEnum {
    MALE = 'MALE',
    FEMELLE = 'FEMELLE'
}

export enum CustomerTypeEnum {
    CUSTOMER = 'CUSTOMER',
    ADMINISTRATION = 'ADMINISTRATION'
}

export enum RoleEnum {
    admin = 'admin',
    patient = 'patient',
    doctor = 'doctor'
}