import { ConflictException, Get, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'; // to tell mongoose we want to inject a model
import { Model } from 'mongoose'; // 
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import * as bcrypt from 'bcrypt'


@Injectable()
export class UserService {


    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    // fetch all users
    async getAllUsers(): Promise<User[]> {
        const users = await this.userModel.find().exec();
        
        return users;
    }

    // fetch a single user
    async getSingleUser(userId): Promise<User> {
        const user = await await this.userModel.findById(userId).exec() 
        // if there is no user with that id, notFoundexception is enought smarth to throw 404 error
        if(!user) {
            throw new NotFoundException(`User does not exist`)
        }
        return user;
    }




    // edit a User
    async editUser(userId, dataToUpdate: CreateUserDto): Promise<User> {
        const updatedUser = await this.userModel.findByIdAndUpdate(userId, dataToUpdate, {new: true})
        return updatedUser
    }


    //delete or deactivate a User
    async deleteUser(userId): Promise<any> {
        this.getSingleUser(userId) // calling this function for verifying if user exist
        const deletedUser = await this.userModel.findByIdAndRemove(userId)
        return deletedUser

        // if We just want to deativate the user

        // const deletedUser = await this.getSingleUser(userId)
        // deletedUser.isActive = false
        // deletedUser.save()
        // return deletedUser
    }


}
