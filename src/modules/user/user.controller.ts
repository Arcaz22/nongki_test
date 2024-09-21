import { Body, Controller, Delete, Get, HttpStatus, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { AuthenticatedRequest } from "src/common/interface/user-interface";
import { BaseResponse } from "src/common/responses/base-response";
import { ProfileDTO } from "./dto/profile.dto";
import { Profile } from "src/common/entities/profil.entity";
import { SUCCESS_MESSAGES } from "src/common/utils/constants";
import { AuthGuard } from '@nestjs/passport';
import { QueryDTO } from "src/common/dto/query.dto";
import { User } from "src/common/entities/user.entity";
@ApiTags('User')
@Controller('user')
@ApiBearerAuth('JWT')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get()
    @ApiQuery({ name: 'search', required: false, description: 'Search User by email' })
    @ApiQuery({ name: 'page', required: false, description: 'The page number for pagination' })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
    async getAllMembers(@Query() query: QueryDTO): Promise<BaseResponse<{ data: User[], count: number }>> {
        const { data, count } = await this.userService.getAllUser(query);
        return new BaseResponse<{ data: User[], count: number }>(
            HttpStatus.OK,
            SUCCESS_MESSAGES.USER_FETCHED,
            { data, count }
        );
    }

    @Post('add-profile')
    @UseGuards(AuthGuard('jwt'))
    async addProfile(@Req() req: AuthenticatedRequest, @Body() add: ProfileDTO) {
        const userId = req.user.userId
        const user = await this.userService.addProfile(userId, add);
        return new BaseResponse<Profile>
        (
            HttpStatus.CREATED,
            SUCCESS_MESSAGES.PROFILE_CREATED,
            user
        );
    }

    @Patch('update-profile')
    @UseGuards(AuthGuard('jwt'))
    async updateProfile(@Req() req: AuthenticatedRequest, @Body() profileData: ProfileDTO) {
        const userId = req.user.userId;
        const updatedProfile = await this.userService.updateProfile(userId, profileData);
        return new BaseResponse<Profile>(
            HttpStatus.OK,
            SUCCESS_MESSAGES.PROFILE_UPDATED,
            updatedProfile
        );
    }

    @Delete()
    @UseGuards(AuthGuard('jwt'))
    async deleteUser(@Req() req: AuthenticatedRequest) {
        await this.userService.deleteUser(req.user.userId);
        return new BaseResponse<string>(
            HttpStatus.OK,
            SUCCESS_MESSAGES.USER_DELETED
        );
    }
}
