import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { Collaboration } from '@tl8/api';
import {
  CreateCollaborationPayload,
  CreateCollaborationUserPayload,
} from '@tl8/collaboration/interfaces';
import { CollaborationService } from '../services/collaboration.service';

@Controller('collaboration')
export class CollaborationController {
  constructor(private collaborationService: CollaborationService) {}

  @Post()
  createCollaboration(@Body() body: CreateCollaborationPayload) {
    return this.collaborationService.create(body);
  }

  @Get(':id')
  async getOne(@Param('id') id: Collaboration['id']) {
    const result = await this.collaborationService.getOne(id);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  @Post('user')
  createUser(@Body() body: CreateCollaborationUserPayload) {
    return this.collaborationService.createUser(body);
  }
}
