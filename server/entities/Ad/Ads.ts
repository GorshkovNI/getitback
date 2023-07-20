// Ad.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import {Photo} from "../Photo/Photos";
import {User} from "../User";
import {Category} from "../Category";
import {AdCustomField} from "../AdCustomField";

@Entity()
export class Ad {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({default: ''})
    description: string;

    @Column()
    price: number;

    @Column({default: ''})
    photo: string;

    @Column()
    city: string;

    @Column({default: false})
    up: boolean;

    @ManyToOne(() => User, (user) => user.posts)
    user: User;

    @ManyToOne(() => Category, (category) => category.posts)
    category: Category;

    @OneToMany(() => Photo, photo => photo.ad)
    photos: Photo[];

    // @OneToMany(() => AdCustomField, (adCustomField) => adCustomField.ad)
    // customFields: AdCustomField[];

    @OneToMany(() => AdCustomField, fieldValue => fieldValue.ad, {
        cascade: true
    })
    customFields: AdCustomField[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
