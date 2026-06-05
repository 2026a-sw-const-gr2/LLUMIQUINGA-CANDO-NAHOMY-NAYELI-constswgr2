import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../../database/entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepo: Repository<TaskEntity>,
  ) {}

  async create(dto: CreateTaskDto): Promise<TaskEntity> {
    const task = this.taskRepo.create({
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      estado: dto.estado,
    });
    
    return await this.taskRepo.save(task);
  }

  async findAll(): Promise<TaskEntity[]> {
    return await this.taskRepo.find({
      order: { fecha_creacion: 'DESC' },
    });
  }

  async findOne(id: string): Promise<TaskEntity> {
    const task = await this.taskRepo.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`La orden de producción con ID ${id} no existe`);
    }
    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<TaskEntity> {
    const task = await this.findOne(id);

    if (dto.titulo) task.titulo = dto.titulo;
    if (dto.descripcion) task.descripcion = dto.descripcion;
    if (dto.estado) task.estado = dto.estado;

    return await this.taskRepo.save(task);
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const task = await this.findOne(id);
    await this.taskRepo.remove(task);
    return { deleted: true };
  }
}