import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from '../../database/entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepo: Repository<EventEntity>,
  ) {}

  async registerEvent(dto: CreateEventDto): Promise<EventEntity> {
    const event = this.eventRepo.create({
      source: dto.source,
      entity: dto.entity,
      action: dto.action,
      payload: dto.payload || null,
    });
    
    return await this.eventRepo.save(event);
  }

  async findAll(): Promise<EventEntity[]> {
    return await this.eventRepo.find({
      order: { timestamp: 'DESC' },
    });
  }

  async findBySource(source: string): Promise<EventEntity[]> {
    return await this.eventRepo.find({
      where: { source },
      order: { timestamp: 'DESC' },
    });
  }

  async findByEntity(entity: string): Promise<EventEntity[]> {
    return await this.eventRepo.find({
      where: { entity },
      order: { timestamp: 'DESC' },
    });
  }
}