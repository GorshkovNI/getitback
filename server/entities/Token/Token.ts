import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tokens')
export class Token {
    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @Column({ unique: true })
    refreshToken: string;

}