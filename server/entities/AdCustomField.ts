import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from 'typeorm';
import { Ad } from './Ad/Ads';
import { CustomField } from './CustomField';

@Entity()
export class AdCustomField {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Ad, (ad) => ad.customFields)
    ad: Ad;

    @ManyToOne(() => CustomField)
    customField: CustomField;

    @Column()
    value: string; // Значение дополнительного поля. Это всегда будет строкой, но вы можете преобразовать его в нужный вам тип данных на стороне клиента.
}