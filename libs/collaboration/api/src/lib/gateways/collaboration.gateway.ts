import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Collaboration } from '@tl8/api';
import {
  ActiveTranslationsMessage,
  ActiveUsersMessage,
  ChangeTranslationMessage,
  PresenceMessage,
  TranslationChangedMessage,
  UserFocusedOnTranslationMessage,
} from '@tl8/collaboration/interfaces';
import { Server, Socket } from 'socket.io';
import { CollaborationService } from '../services/collaboration.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CollaborationGateway {
  private socketsByCollaboration: {
    collaborationId: Collaboration['id'];
    client: Socket;
    userId: string;
  }[] = [];

  constructor(private collaborationService: CollaborationService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('presence')
  async onPresence(
    @MessageBody() data: PresenceMessage,
    @ConnectedSocket() client: Socket
  ) {
    if (
      !this.socketsByCollaboration.find(
        (p) => p.collaborationId === data.collaborationId && p.client === client
      )
    ) {
      this.socketsByCollaboration.push({
        collaborationId: data.collaborationId,
        client,
        userId: data.author.userId,
      });
    }
    await this.collaborationService.addActiveUser(
      data.collaborationId,
      data.author
    );
    client.on('disconnect', async () => {
      await this.collaborationService.removeUserFromAllActivities(
        data.collaborationId,
        data.author.userId
      );
      this.socketsByCollaboration = this.socketsByCollaboration.filter(
        (p) => p.client !== client
      );
      this.broadcastActiveUsers(data.collaborationId);
    });
    this.sendCollaboration(data.collaborationId, client);
    this.sendActiveTranslationsToClients(data.collaborationId, [client]);
    this.broadcastActiveUsers(data.collaborationId);
    return true;
  }

  @SubscribeMessage('changeTranslation')
  async onChangeTranslation(
    @MessageBody() data: ChangeTranslationMessage,
    @ConnectedSocket() client: Socket
  ) {
    await this.collaborationService.changeTranslation(
      this.getSocketByCollaborationFromSocket(client).collaborationId,
      data
    );
    this.broadcastChangeToAllButSourceClient(data, client);
    return true;
  }

  @SubscribeMessage('addActiveUserOnTranslation')
  async onAddActiveUserOnTranslation(
    @MessageBody() data: UserFocusedOnTranslationMessage,
    @ConnectedSocket() client: Socket
  ) {
    const collaborationId =
      this.getSocketByCollaborationFromSocket(client).collaborationId;
    await this.collaborationService.addActiveUserOnTranslation(
      collaborationId,
      data.author,
      data.params
    );
    this.broadcastActiveTranslations(collaborationId);
    return true;
  }

  @SubscribeMessage('removeActiveUserFromTranslation')
  async onRemoveActiveUserFromTranslation(
    @MessageBody() data: UserFocusedOnTranslationMessage,
    @ConnectedSocket() client: Socket
  ) {
    const collaborationId =
      this.getSocketByCollaborationFromSocket(client).collaborationId;
    await this.collaborationService.removeActiveUserFromTranslation(
      collaborationId,
      data.author,
      data.params
    );
    this.broadcastActiveTranslations(collaborationId);
    return true;
  }

  private async broadcastActiveTranslations(
    collaborationId: Collaboration['id']
  ) {
    await this.sendActiveTranslationsToClients(
      collaborationId,
      this.getAllClientsOfCollaboration(collaborationId).map(
        ({ client }) => client
      )
    );
  }

  private async broadcastActiveUsers(collaborationId: Collaboration['id']) {
    await this.sendActiveUsersToClients(
      collaborationId,
      this.getAllClientsOfCollaboration(collaborationId).map(
        ({ client }) => client
      )
    );
  }

  private async sendActiveUsersToClients(
    collaborationId: Collaboration['id'],
    clients: Socket[]
  ) {
    const message: ActiveUsersMessage = {
      activeUsers:
        await this.collaborationService.getActiveUsersOfCollaboration(
          collaborationId
        ),
    };
    return clients.forEach((client) => client.emit('activeUsers', message));
  }

  private async sendActiveTranslationsToClients(
    collaborationId: Collaboration['id'],
    clients: Socket[]
  ) {
    const message: ActiveTranslationsMessage = {
      activeTranslations:
        await this.collaborationService.getActiveTranslationsOfCollaboration(
          collaborationId
        ),
    };
    return clients.forEach((client) =>
      client.emit('activeTranslations', message)
    );
  }

  private async broadcastChangeToAllButSourceClient(
    changeTranslationMessage: ChangeTranslationMessage,
    notTo: Socket
  ) {
    const collaborationId =
      this.getSocketByCollaborationFromSocket(notTo).collaborationId;
    const message: TranslationChangedMessage = {
      changeTranslationMessage,
      currentWork: (await this.collaborationService.getOne(collaborationId))
        .work,
    };
    return this.getAllClientsOfCollaboration(collaborationId)
      .filter(({ client }) => notTo !== client)
      .forEach(async ({ client }) =>
        client.emit('translationChanged', message)
      );
  }

  private async sendCollaboration(
    collaborationId: Collaboration['id'],
    client: Socket
  ) {
    client.emit(
      'collaboration',
      await this.collaborationService.getOne(collaborationId)
    );
  }

  private getAllClientsOfCollaboration(collaborationId: Collaboration['id']) {
    return this.socketsByCollaboration.filter(
      (p) => p.collaborationId === collaborationId
    );
  }

  private getSocketByCollaborationFromSocket(client: Socket) {
    const result = this.socketsByCollaboration.find((s) => s.client === client);
    if (!result) {
      throw new Error('This socket is not associated to any collaboration');
    }
    return result;
  }
}
