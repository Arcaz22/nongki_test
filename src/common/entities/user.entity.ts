import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Profile } from './profil.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @OneToOne(() => Profile, profile => profile.user, { eager: true, cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    profile: Profile;
}
