import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CollaborationController } from './controllers/collaboration.controller';
import { CollaborationGateway } from './gateways/collaboration.gateway';
import { CollaborationEntity } from './model/collaboration.entity';
import { UserEntity } from './model/user.entity';
import { CollaborationService } from './services/collaboration.service';

@Module({
  controllers: [CollaborationController],
  providers: [CollaborationService, CollaborationGateway],
  imports: [MikroOrmModule.forFeature([CollaborationEntity, UserEntity])],
})
export class CollaborationApiModule {}
