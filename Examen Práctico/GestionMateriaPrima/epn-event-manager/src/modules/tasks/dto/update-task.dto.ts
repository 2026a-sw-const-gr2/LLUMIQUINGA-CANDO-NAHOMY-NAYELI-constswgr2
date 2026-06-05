import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  @IsIn(['pendiente', 'en progreso', 'completada'])
  estado?: 'pendiente' | 'en progreso' | 'completada';
}