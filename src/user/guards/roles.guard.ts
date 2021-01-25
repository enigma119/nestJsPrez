import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // Get roles metadata, roles is consistent with the first parameter of SetMetadata() in roles.decorator.ts
        const role = this.reflector.get<string[]>('role', context.getHandler());
        console.log('role1 from middle ware', role)
        
        if (!role) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        // console.log('user from middle ware', request)

        const user = request.user; // Read the user of the request object, which has been set by middleware 
        if(user.role === role) {
            return true
        } else {
            return false
        }

        // const hasRole = () => user.role.some((role) => role.includes(role));
        // return user && user.role && hasRole();
    }

}