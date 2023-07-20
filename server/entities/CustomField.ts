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

    @Column({ type: 'simple-json', nullable: true })
    options: any; // Для хранения вариантов ответа для 'radio' и других типов полей, которые могут их использовать

    @ManyToOne(() => Category, category => category.customFields)
    category: Category;
}