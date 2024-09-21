import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class LoginDTO {
    @ApiProperty({ example: 'test@gmail.com' })
    @IsEmail()
    email: string

    @ApiProperty({ example: 'password' })
    @IsString()
    password: string
}
