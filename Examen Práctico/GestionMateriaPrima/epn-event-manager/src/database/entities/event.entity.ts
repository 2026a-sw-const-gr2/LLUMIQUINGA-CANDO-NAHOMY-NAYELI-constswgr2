import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { RawMaterialPayload } from '../../modules/events/dto/create-event.dto';

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  source!: string;

  @Column()
  entity!: string;

  @Column()
  action!: string;

  // Delegamos la serialización nativa a TypeORM usando simple-json
  @Column({ type: 'simple-json', nullable: true })
  payload!: RawMaterialPayload | null;

  @CreateDateColumn({ type: 'datetime' })
  timestamp!: Date;
}
