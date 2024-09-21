import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { User } from "src/common/entities/user.entity"
import { JwtService } from "@nestjs/jwt"
import { NewUserDTO } from "./dto/new-user.dto"
import { checkUserExistsByEmail, comparePassword, hashPassword } from "src/common/utils/user.utils"
import { ERROR_MESSAGES } from "src/common/utils/constants"
import { LoginDTO } from "./dto/login.dto"

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) protected readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async register(newUser: NewUserDTO): Promise<User> {
        const userExists = await checkUserExistsByEmail(this.userRepository, newUser.email);
        if (userExists) {
            throw new ConflictException('User already exists');
        }

        const hashedPassword = await hashPassword(newUser.password);

        const user = this.userRepository.create({
            ...newUser,
            password: hashedPassword,
        });

        const savedUser = await this.userRepository.save(user);
        delete savedUser.password;
        return savedUser;
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await checkUserExistsByEmail(this.userRepository, email)
        if (!user) {
            throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS)
        }

        const isPasswordValid = await comparePassword(password, user.password)
        if (!isPasswordValid) {
            throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS)
        }

        return user
    }

    async login(existingUser: LoginDTO) {
        const user = await this.validateUser(existingUser.email, existingUser.password)
        if (!user) {
            throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS)
        }

        const payload = { sub: user.id, email: user.email }
        const access_token = this.jwtService.sign(payload)

        return {
            user: {
                id: user.id,
                email: user.email,
            },
            access_token
        };
    }
}
