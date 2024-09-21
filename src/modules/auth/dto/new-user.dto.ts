import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class NewUserDTO {
    @ApiProperty({ example: 'test@gmail.com' })
    @IsEmail()
    email: string

    @ApiProperty({ example: 'password' })
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    password: string
}
