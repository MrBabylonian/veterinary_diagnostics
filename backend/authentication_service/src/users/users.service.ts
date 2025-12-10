import { Injectable, NotFoundException } from '@nestjs/common';
import { UserForPublicDto, type User } from '../dto/user';
import { UUID } from 'crypto';
import { plainToClass } from 'class-transformer';


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


    findByEmail(email: string): UserForPublicDto | undefined {
        const user = this.users.find(user => user.email === email);

        if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }

        return plainToClass(UserForPublicDto, user, { excludeExtraneousValues: true });
    }


    findById(id: string | UUID): UserForPublicDto | undefined {
        const user = this.users.find(user => user.id === id);
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return plainToClass(UserForPublicDto, user, { excludeExtraneousValues: true });
    }

    create(user: Omit<User, 'id'>): UserForPublicDto {
        const newUser: User = {
            id: crypto.randomUUID(),
            ...user, // email and passwordHash
        };
        this.users.push(newUser);
        return plainToClass(UserForPublicDto, newUser, { excludeExtraneousValues: true });
    }
}
