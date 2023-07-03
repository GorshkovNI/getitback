import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    phone: string;

    @Column()
    password: string;

    @Column()
    activation_link: string;

    @Column()
    is_activated: string;

    @Column()
    phone_number: string;

}