import { Body, Controller, Get, HttpStatus, Post, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { AuthService } from "./auth.service"
import { NewUserDTO } from "./dto/new-user.dto";
import { User } from "src/common/entities/user.entity";
import { BaseResponse } from "src/common/responses/base-response";
import { SUCCESS_MESSAGES } from "src/common/utils/constants";
import { LoginDTO } from "./dto/login.dto";

@ApiTags('Auth')
@Controller('auth')
@ApiBearerAuth('JWT')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('register')
    async register(@Body() newUser: NewUserDTO) {
        const user = await this.authService.register(newUser);
        return new BaseResponse<User>
        (
            HttpStatus.CREATED,
            SUCCESS_MESSAGES.USER_CREATED,
            user
        );
    }

    @Post('login')
    async loginUser(@Body() existingUser: LoginDTO) {
        const loginResult = await this.authService.login(existingUser)
        const response = new BaseResponse<{ access_token: string }>(HttpStatus.OK, SUCCESS_MESSAGES.USER_LOGGED_IN, loginResult)
        return response
    }
}
