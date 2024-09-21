import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile } from "src/common/entities/profil.entity";
import { User } from "src/common/entities/user.entity";
import { Repository } from "typeorm";
import { ProfileDTO } from "./dto/profile.dto";
import { ERROR_MESSAGES } from "src/common/utils/constants";
import { QueryDTO } from "src/common/dto/query.dto";
import { applySearchFilter } from "src/common/utils/search";
import { applyPagination } from "src/common/utils/pagination";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) protected readonly userRepository: Repository<User>,
        @InjectRepository(Profile) protected readonly profileRepository: Repository<Profile>,
    ) {}

    async getAllUser(query: QueryDTO): Promise<{ data: User[], count: number }> {
        const queryBuilder = this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.profile', 'profile')

        applySearchFilter(queryBuilder, query.search, ['email']);

        const { data, count } = await applyPagination(queryBuilder, query.page, query.limit);

        return { data, count };
    }

    async addProfile(userId: string, add: ProfileDTO): Promise<Profile> {
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['profile'] });

        if (!user) {
            throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
        }

        if (user.profile) {
            throw new ConflictException(ERROR_MESSAGES.PROFILE_ALREADY_EXISTS);
        }

        const newProfile = this.profileRepository.create({
            ...add,
            user,
        });

        const savedProfile = await this.profileRepository.save(newProfile);

        return savedProfile;
    }

    async updateProfile(userId: string, profileData: ProfileDTO): Promise<Profile> {
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['profile'] });

        if (!user) {
            throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
        }

        if (!user.profile) {
            throw new NotFoundException(ERROR_MESSAGES.PROFILE_NOT_FOUND);
        }

        const updatedProfile = await this.profileRepository.preload({
            id: user.profile.id,
            ...profileData
        });

        if (!updatedProfile) {
            throw new NotFoundException('Failed to load a profile for updating.');
        }

        return this.profileRepository.save(updatedProfile);
    }

    async deleteUser(userId: string): Promise<void> {
        const result = await this.userRepository.delete(userId);
        if (result.affected === 0) {
            throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
        }
    }
}
