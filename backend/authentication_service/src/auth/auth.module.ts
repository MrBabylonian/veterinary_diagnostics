import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';

@Module({
    providers: [AuthService],
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'CHANGE_ME_IN_PRODUCTION',
            signOptions: { expiresIn: '72h' }
        }),
        UsersModule],
    exports: [AuthService]
})
export class AuthModule { }
