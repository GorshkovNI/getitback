import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from 'typeorm';
import { Category } from './Category';

@Entity()
export class CustomField {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    fieldType: string; // Тип поля (например, 'text', 'number', 'date' и т.д.)

    @ManyToOne(() => Category, (category) => category.customFields)
    category: Category;
}