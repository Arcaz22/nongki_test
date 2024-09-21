import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProfileDTO {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    full_name: string;

    @ApiProperty({ example: '123 Main Street' })
    @IsString()
    address: string;

    @ApiProperty({ example: 'male' })
    @IsString()
    gender: string;

    @ApiProperty({ example: 'single' })
    @IsString()
    status: string;
}
