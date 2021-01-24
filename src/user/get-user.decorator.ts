import { createParamDecorator } from "@nestjs/common";
import { User } from './user.model'

export const GetUser = createParamDecorator((data, req): User => {
        return req.user
})