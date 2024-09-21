import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    full_name: string;

    @Column()
    address: string;

    @Column()
    gender: string;

    @Column()
    status: string;

    @OneToOne(() => User, user => user.profile)
    user: User;
}
