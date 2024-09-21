import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from '../entities/user.entity'

export async function checkUserExistsByEmail(
    repository: Repository<User>,
    email: string,
): Promise<User | null> {
    const user = await repository.findOne({
    where: { email },
    });
    return user || null
}

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
}
