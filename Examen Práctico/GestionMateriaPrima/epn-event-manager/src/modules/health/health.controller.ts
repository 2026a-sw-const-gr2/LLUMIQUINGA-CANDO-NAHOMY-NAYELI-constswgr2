import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  async check() {
    try {
      // Forzamos un ping real y directo al motor de la base de datos SQLite
      await this.dataSource.query('SELECT 1');
      
      return {
        status: 'ok',
        database: 'connected',
        monitored_system: 'Gestión de Materia Prima',
        timestamp: new Date().toISOString(), // Formato ISO internacional UTC
      };
    } catch (error) {
      // Manejo preventivo y seguro de excepciones tipadas
      const message = error instanceof Error ? error.message : 'Unknown error';
      
      return {
        status: 'error',
        database: 'disconnected',
        error: message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}