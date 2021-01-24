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



    async createUser(registrationData: CreateUserDto): Promise<void> {

        const { email, password} = registrationData

        const exist = await this.userModel.findOne({ email }) // find user with the search criteria(email)

        if (exist) { // return conflic if user alredy exit
            throw new ConflictException('Email already exist')
        }

        registrationData.salt = await bcrypt.genSalt() //generate salt and store it to the database
        registrationData.password = await this.hashPassword(password, registrationData.salt) // store hashed password by calling hashPassword Function

        const user = new this.userModel(registrationData);
        await user.save();

    }


    // hash password 
    private hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
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
