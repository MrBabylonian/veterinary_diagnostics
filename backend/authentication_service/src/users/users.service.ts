import { UUID } from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateUserDto, type User, UserForPublicDto } from '@workspace/shared/dto/user';


@Injectable()
export class UsersService {
    private users: User[] = [
        {
            id: '1' as unknown as UUID,
            email: "text@example.com",
            email_verified_at: undefined,
            phone_number: "+1234567890",
            name: "John",
            middle_name: undefined,
            last_name: "Doe",
            password_hash: "$argon2id$v=19$m=65536,t=3,p=4$hLlYEyE9IaWYOR0Fy1iSPA$mTA7lMqBOhh2yCsfRBrMqEp0uBD2XiYrSGcl7CgEblM",
            auth_provider: "local",
            auth_subject: undefined,
            mfa_enabled: false,
            last_login_at: undefined,
            timezone: 'CEST',
            locale: 'IT',
            avatar_url: undefined,
            settings: {}
        }
    ];

    // TODO: Make sure getters are returning UserForPublicDto with plainToClass after implementing database

    findByEmail(email: string): UserForPublicDto {
        const user = this.users.find(user => user.email === email);

        if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }

        return plainToClass(UserForPublicDto, user, { excludeExtraneousValues: true });
    }

    findByEmailForValidation(email: string): User {
        const user = this.users.find(user => user.email === email);

        if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }

        return user;
    }

    findById(id: string | UUID): UserForPublicDto | undefined {

        const user = this.users.find(user => user.id === id);
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return plainToClass(UserForPublicDto, user, { excludeExtraneousValues: true });
    }

    create(userToCreate: User) {
        this.users.push(userToCreate);
        const registeredUser = plainToClass(UserForPublicDto, userToCreate, { excludeExtraneousValues: true });
        return {
            status: 201,
            registeredUser
        };
    }
}