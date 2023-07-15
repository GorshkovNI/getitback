// Photo.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import {Ad} from "../Ad/Ads";

@Entity()
export class Photo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    url: string;

    @ManyToOne(() => Ad, ad => ad.photos)
    ad: Ad;
}
