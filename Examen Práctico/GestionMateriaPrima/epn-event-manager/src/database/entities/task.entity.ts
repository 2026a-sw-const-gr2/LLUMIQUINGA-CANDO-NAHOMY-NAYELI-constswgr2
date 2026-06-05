import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  titulo!: string; // Ej: "Amasado de Lote - Pan de Naranja"

  @Column({ nullable: true })
  descripcion?: string; // Ej: "Uso de 50KG de Harina y 10L de jugo de naranja"

  @Column({ default: 'pendiente' })
  estado!: 'pendiente' | 'en progreso' | 'completada'; // Control de estado de la orden

  // Campos de control preventivo de tiempos de producción
  @CreateDateColumn({ type: 'datetime' })
  fecha_creacion!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  fecha_actualizacion!: Date;
}