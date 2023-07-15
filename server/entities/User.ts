import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import {Ad} from "./Ad/Ads";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    phone: string;

    @Column()
    password: string;

    @Column()
    activation_link: string;

    @Column()
    is_activated: boolean;

    @OneToMany(() => Ad, (post) => post.user)
    posts: Ad[];

}