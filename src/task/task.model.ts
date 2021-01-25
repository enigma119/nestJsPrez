import * as mongoose from 'mongoose'

export const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: {
        type: String,
        enum: ['INPROGRESS', 'DONE', 'OPEN']
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: Date,
    updatedAt: Date,
})



export interface Task extends mongoose.Document {
    title: string;
    description: string;
    status: StatusEnum;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export enum StatusEnum {
    INPROGRESS = 'INPROGRESS',
    DONE = 'DONE',
    OPEN = 'OPEN'
};