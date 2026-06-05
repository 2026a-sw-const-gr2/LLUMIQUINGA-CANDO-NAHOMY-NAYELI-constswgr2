import { Module } from '@nestjs/common';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DatabaseModule } from './database/database.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { EventsModule } from './modules/events/events.module';
import { StatsModule } from './modules/stats/stats.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // Servir los archivos del Frontend (index.html, app.js, styles.css)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // __dirname es dist/src, .. es dist/, luego /public
    }),
    DatabaseModule,
    TasksModule,
    EventsModule,
    StatsModule,
    HealthModule,
  ],
})
export class AppModule {}