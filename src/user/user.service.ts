import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'; // 
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';

@Injectable()
export class UserService {

    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    // Fetch all users
    async getUsers(): Promise<User[]> {
        const users = await this.userModel.find().exec();
        return users;
    }


    // Get a single user
    async getUserbyId(userId): Promise<User> {
        const user = await await this.userModel.findById(userId).exec() 
        if(!user) {
            throw new NotFoundException(`User does not exist`)
        }
        return user;
    }


    // Edit a User
    async editUser(userId, dataToUpdate: CreateUserDto): Promise<User> {
        const updatedUser = await this.userModel.findByIdAndUpdate(userId, dataToUpdate, {new: true})
        return updatedUser
    }


    // Delete or deactivate a User
    async deleteUser(userId): Promise<any> {
        this.getUserbyId(userId) 
        const deletedUser = await this.userModel.findByIdAndRemove(userId)
        return deletedUser
    }


}
