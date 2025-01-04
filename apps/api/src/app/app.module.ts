import { Module } from '@nestjs/common';
import { CollaborationApiModule } from '@tl8/collaboration/api';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    CollaborationApiModule,
    MikroOrmModule.forRoot({
      autoLoadEntities: true,
      type: 'mongo',
      clientUrl: process.env.MONGO_URL,
      allowGlobalContext: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
