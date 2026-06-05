import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsIn(['pendiente', 'en progreso', 'completada'])
  estado!: 'pendiente' | 'en progreso' | 'completada';
}