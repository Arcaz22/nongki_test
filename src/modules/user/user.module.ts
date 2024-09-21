import { Module } from '@nestjs/common'
import { User } from 'src/common/entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { Profile } from 'src/common/entities/profil.entity'
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Profile]),
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
